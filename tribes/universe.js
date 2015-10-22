Universe = new (function() {

	this.reset = function() {

		this._id = 0;

		// Current turn number
		this.turn = 1;

		// All islands
		this.islands = [];

		// All tribes
		this.tribes = [];

		// Player's tribe
		this.player = null;

		// The tribe which plays now
		this.curTribe = null;
	}

	this.id = function() {
		return this._id++;
	};

	this.build = function( par ) {

		this.reset();

		var seed = new Date().getTime();
		var rnd = new Phaser.RandomDataGenerator( [seed] );

		var landNoise = new Phaser.Plugin.Perlin( rnd.between( 0, 255 ) );
		var sizeNoise = new Phaser.Plugin.Perlin( rnd.between( 0, 255 ) );
		var fertNoise = new Phaser.Plugin.Perlin( rnd.between( 0, 255 ) );
		var minNoise = new Phaser.Plugin.Perlin( rnd.between( 0, 255 ) );

		// Candidates to become home islands
		var homeIslands = [];

	islandsLoop:
		while (Universe.islands.length < par.nIslands) {

			var x = Math.random() * Universe.SIZE;
			var y = Math.random() * Universe.SIZE;
			var spawn = landNoise.noiseHigh( x / Universe.SIZE * 2, y / Universe.SIZE * 2, 2, 2 ) + 1;	// ~[0..2]

			// More islands at the center, no islands in the corners
			var dx = x / Universe.SIZE2 - 1;
			var dy = y / Universe.SIZE2 - 1;
			var d = 1 - dx * dx - dy * dy;
			spawn = d > 0 ? spawn * Math.sqrt( d ) : 0;

			if (Math.random() * 2 > spawn) {
				continue;
			}

			// Discard islands which are too close to other existing islands
			for (var i in Universe.islands) {
				var isl = Universe.islands[i];
				var d = this.distance2( {x: x, y: y}, isl );
				if (d < Universe.MIN_DISTANCE2) {
					continue islandsLoop;
				}
			}

			var params = {};

			// Maximum population size
			var size = (sizeNoise.noiseHigh( x / Universe.SIZE * 2, y / Universe.SIZE * 2, 2, 1 ) + 1) / 2 * Math.random();
			params.size = Island.MIN_SIZE + (Island.MAX_SIZE - Island.MIN_SIZE) * size; 

			// Fertility
			var fert = fertNoise.noiseHigh( x / Universe.SIZE * 2, y / Universe.SIZE * 2, 2, 1 ) + 1;
			if (fert < 0.6) {
				params.fertility = Island.BARREN;
			} else if (fert > 1.4) {
				params.fertility = Island.FERTILE;
			}

			// Minerals
			var min = (fertNoise.noiseHigh( x / Universe.SIZE * 2, y / Universe.SIZE * 2, 2, 1 ) + 1) * Math.random();
			if (min < 0.1) {
				params.minerals = Island.POOR;
			} else if (min > 0.9) {
				params.minerals = Island.RICH;
			}

			do {
				var name = Island.randomName();
				for (var i in Universe.islands) {
					var isl = Universe.islands[i];
					if (isl.name == name) {
						name = null;
						break;
					}
				}
			} while (!name);
			params.name = name;

			var island = Universe.add( new Island( x, y, params ) );

			// An island can become a home island if
			// - it's medium sized
			// - it's good enough, but not too good
			if (island.size > Island.MIN_SIZE + (Island.MAX_SIZE - Island.MIN_SIZE) * 1/3 &&
				island.size < Island.MIN_SIZE + (Island.MAX_SIZE - Island.MIN_SIZE) * 2/3 &&
				island.fertility + island.minerals == 0) {
				homeIslands.push( island );
			}
		}

		console.log( homeIslands, par.tribes );
		if (homeIslands.length < par.tribes.length) {
			console.log( "try again" )
			return false;
		}

		this.tribes = par.tribes;
		this.player = 
		this.curTribe = 
			this.tribes.length ? this.tribes[0] : null;;

		// For each tribe we select one vacant island as a home island
		for (var i in this.tribes) {
			var tribe = par.tribes[i];
			do {
				var island = rnd.pick( homeIslands );
			} while (island.tribe != null);

			tribe.addIsland( island, island.size / 2 );
		}

		return true;
	}

	this.add = function( island ) {
		this.islands.push( island );
		return island;
	};

	this.endTurn = function() {
		var i = this.tribes.indexOf( this.curTribe ) + 1;
		this.curTribe = this.tribes[i < this.tribes.length ? i : 0];

		if (this.curTribe == this.player) {
			this.turn++;
		}

		this.curTribe.process();
	};

	this.time2sail = function( tribe, from, to ) {
		var dx = to.x - from.x;
		var dy = to.y - from.y;
		return Math.ceil( Math.sqrt( (dx * dx + dy * dy) / Universe.MIN_DISTANCE2 ) );
	};

	this.distance = function( a, b ) {
		return Math.sqrt( this.distance2( a, b ) );
	};

	this.distance2 = function( a, b ) {
		var dx = a.x - b.x;
		var dy = a.y - b.y;
		return dx * dx + dy * dy;
	};
})();

Universe.SIZE = 1000;
Universe.SIZE2 = Universe.SIZE / 2;
Universe.MIN_DISTANCE2 = (Universe.SIZE / 20) * (Universe.SIZE / 20);