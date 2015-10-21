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
}

Tribe.NORSE	= function() { return new Tribe( {name: 'Norse', flag: 0, color: 0xff4040} ) };
Tribe.SLAVS	= function() { return new Tribe( {name: 'Slavs', flag: 1, color: 0xbb40ff} ) };
Tribe.CELTS	= function() { return new Tribe( {name: 'Celts', flag: 2, color: 0x40bbff} ) };

Tribe.ALL	= function() { return [Tribe.NORSE(), Tribe.SLAVS(), Tribe.CELTS()] };

Tribe.prototype.process = function() {
	this.grow();
	this.advance();
}

Tribe.prototype.grow = function() {
	for (var i in this.islands) {
		var island = this.islands[i];
		island.grow();
	}
}

Tribe.prototype.advance = function() {
	for (var i in this.fleets) {
		var fleet = this.fleets[i];
		fleet.advance();
	}
}

Tribe.prototype.launch = function( tribe, from, to, size ) {
	var fleet = new Fleet( this, from, to, size, Universe.time2sail( tribe, from, to ) );
	this.fleets[fleet.id] = fleet;
	from.population -= size;

	oceanTribes.map.addFleet( fleet );

	return fleet;
}

Tribe.prototype.think = function() {

	var ids1 = [];
	for (var i in this.islands) {
		if (this.islands[i].population > 1) {
			ids1.push( i );
		}
	}

	var ids2 = [];
	for (var i in this.knownIslands) {
		if (this.knownIslands[i].tribe == null) {
			ids2.push( i );
		}
	}

	if (ids2.length) {
		var src = this.islands[ids1[Math.floor(Math.random() * ids1.length)]];
		var dst = this.knownIslands[ids2[Math.floor(Math.random() * ids2.length)]];
		this.launch( this, src, dst, 1 + Math.floor(Math.random() * src.population / 2) );
	}

	Universe.endTurn();
}

Tribe.prototype.addIsland = function( island, population ) {

	this.islands[island.id] = island;
	if (!this.home) {
		this.home = island;
	}

	island.tribe = this;
	island.population = population;

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
	return Math.sqrt( Universe.MIN_DISTANCE2 ) * 3;
}