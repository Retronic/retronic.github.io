function Tribe( params ) {

	this.id = Universe.id();

	params = params || {};

	this.name = params.name || 'Savages';
	this.flag = params.flag || 0;
	this.color = params.color || 0xFFFFFF;

	// Map of islands which belong to this tribe
	this.islands = {};

	// Map of islands which this tribe is aware of (including its own ones)
	this.knownIslands = {};

	// Home island of the tribe
	this.home = null;

	// Map of all fleets launched by this tribe
	this.fleets = {};

	this.gold = 1000;
	this.tech = 1;
	this.progress = 0;

	this.state = Tribe.State.NOT_PROCESSED;
	this.assaulting = [];

	this.viewDistance = Math.sqrt( Universe.MIN_DISTANCE2 ) * 3;
}

Tribe.NORSE	= function() { return new Tribe( {name: 'Norse', flag: 0, color: 0xff4040} ) };
Tribe.SLAVS	= function() { return new Tribe( {name: 'Slavs', flag: 1, color: 0xbb40ff} ) };
Tribe.CELTS	= function() { return new Tribe( {name: 'Celts', flag: 2, color: 0x40bbff} ) };

Tribe.ALL	= function() { return [Tribe.NORSE(), Tribe.SLAVS(), Tribe.CELTS()] };

Tribe.State = {
	NOT_GROWN		: "not grown",
	NOT_PROCESSED	: "not processed",
	PROCESSED		: "processed",
	PROCESSING		: "processing"
};

Tribe.prototype.grow = function() {
	for (var i in this.islands) {
		var island = this.islands[i];
		island.launched = false;
		island.grow();
	}

	var techUp = false;
	var upgrades = [];
	while (this.progress >= this.tech * 100) {
		this.progress -= this.tech * 100;
		this.tech++;
		var upgrade = this.techUp();
		if (upgrade) {
			upgrades.push( upgrade );
		}
		techUp = true;
	}

	if (this == Universe.player && techUp) {
		gamelog.message( 6, 'You have reached tech level ' + this.tech );
		if (upgrades.length) {
			gamelog.message( 0, upgrades.join( '\n' ) );
		}
	}

	this.assaulting = [];
	for (var i in this.fleets) {
		var fleet = this.fleets[i];
		fleet.advance();
		if (!fleet.isAlive) {
			delete this.fleets[i];
		}
	}

	this.state = Tribe.State.NOT_PROCESSED;
}

Tribe.prototype.process = function() {

	var assault = this.assaulting.shift();
	if (assault) {
		if (this == Universe.player || assault.to.tribe == Universe.player) {
			var popup = PopUp.show( new AssaultPopUp( game, assault ) );
		} else {
			AssaultPopUp.resolve( assault );
			assault = null;
		}
	}

	if (this == Universe.player) {
		this.state = Tribe.State.PROCESSING;
	} else {
		if (assault) {
			this.state = Tribe.State.PROCESSING;
		} else {
			this.think();
		}
	}
}

Tribe.prototype.launch = function( tribe, from, to, size, type ) {
	var fleet = new Fleet( this, from, to, size, type, Universe.time2sail( tribe, from, to ) );
	this.fleets[fleet.id] = fleet;
	from.population -= size;
	from.launched = true;

	oceanTribes.map.addFleet( fleet );

	return fleet;
}

Tribe.prototype.think = function() {

	var ids1 = [];
	for (var i in this.islands) {
		if (this.islands[i].canLaunch()) {
			ids1.push( i );
		}
	}

	var ids2 = [];
	for (var i in this.knownIslands) {
		if (this.knownIslands[i].tribe != this) {
			ids2.push( i );
		}
	}

	if (ids1.length && ids2.length) {
		var src = this.islands[ids1[Math.floor(Math.random() * ids1.length)]];
		var dst = this.knownIslands[ids2[Math.floor(Math.random() * ids2.length)]];
		this.launch( this, src, dst, 1 + Math.floor(Math.random() * src.population / 2), Fleet.SETTLER );
	}

	for (var i in this.islands) {
		var island = this.islands[i];
		if (island.curTask == null) {
			if (!island.has( Buildings.OUTPOST )) {
				island.curTask = {
					name		: Buildings.OUTPOST,
					progress	: 0
				}
			} else if (!island.has( Buildings.SHIPYARD )) {
				island.curTask = {
					name		: Buildings.SHIPYARD,
					progress	: 0
				}
			}
		}
	}

	this.state = Tribe.State.PROCESSED;
}

Tribe.prototype.addIsland = function( island, population ) {

	if (island.tribe) {
		island.tribe.removeIsland( island );
	}

	this.islands[island.id] = island;
	if (!this.home) {
		this.home = island;
		this.home.buildings = [Buildings.OUTPOST, Buildings.SHIPYARD];
	}

	island.tribe = this;
	island.population = population;
	island.curTask = null;

	island.onChanged.dispatch();

	this.updateIslandsVisibility();
}

Tribe.prototype.removeIsland = function( island ) {
	delete this.islands[island.id];

	if (this.home == island) {
		var ids = [];
		for (var i in this.islands) {
			ids.push( i );
		}
		if (ids.length) {
			this.home = this.islands[ids[Math.floor(Math.random() * ids.length)]];
			this.home.onChanged.dispatch();
		}
	}

	island.tribe = null;
	island.population = 0;

	island.onChanged.dispatch();

	this.updateIslandsVisibility();
}

Tribe.prototype.updateIslandsVisibility = function() {

	var r2 = this.getViewDistance();
	r2 *= r2;

	for (var i in this.islands) {
		var isl1 = this.islands[i];
		this.knownIslands[i] = isl1;
		for (var j in Universe.islands) {
			// If island {j} is already known, skip it
			if (this.knownIslands[j]) {
				continue;
			}
			var isl2 = Universe.islands[j];
			if (Universe.distance2( isl1, isl2 ) < r2) {
				this.knownIslands[j] = isl2;
			}
		}
	}
}

Tribe.prototype.getViewDistance = function() {
	return  this.viewDistance;
}

Tribe.prototype.techUp = function() {
	if (this.tech == 2 || this.tech == 4 || this.tech == 7) {
		this.viewDistance += Math.sqrt( Universe.MIN_DISTANCE2 );
		this.updateIslandsVisibility();
		return "Now you can sail further";
	}
}