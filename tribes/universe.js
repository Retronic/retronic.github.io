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
		var biomNoise = new Phaser.Plugin.Perlin( rnd.between( 0, 255 ) );

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

			// Biomes
			var biome = biomNoise.noiseHigh( x / Universe.SIZE * 2, y / Universe.SIZE * 2, 2, 1 ) + 1;
			if (biome < 0.6) {
				params.resource = Island.Resources.GAME;	// [0..0.6]
			} else if (biome < 0.8) {
				params.resource = Island.Resources.TIMBER;	// [0.6..0.8]
			} else if (biome < 1.4) {
				params.resource = null;						// [0.8..1.4]
			} else if (biome < 1.6) {
				params.resource = Island.Resources.CLIFFS;	// [1.4..1.6]
			} else {
				params.resource = Island.Resources.STONE;	// [1.6..2]
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
			if (island.size > Island.MIN_SIZE + (Island.MAX_SIZE - Island.MIN_SIZE) * 1/3 &&
				island.size < Island.MIN_SIZE + (Island.MAX_SIZE - Island.MIN_SIZE) * 2/3) {
				homeIslands.push( island );
			}
		}

		// Each home island should have at least 2 islands
		// within 3 turns from it
		var h = homeIslands.concat();
		homeIslands = [];
		for (var i in h) {
			var island = h[i];
			var count = 0;
			for (var j in this.islands) {
				var isl = this.islands[j];
				if (isl == island) {
					continue;
				}
				if (this.distance2( island, isl ) < 9 * Universe.MIN_DISTANCE2) {
					count++;
					if (count >= 2) {
						break;
					}
				}
			}
			if (count >= 2) {
				homeIslands.push( island );
			}
		}

		if (homeIslands.length < par.tribes.length) {
			console.log( "not enough home island candidates" );
			return false;
		}

		this.tribes = par.tribes;
		this.player = 
		this.curTribe = 
			this.tribes.length ? this.tribes[0] : null;;

		// For each tribe we select one vacant island as a home island
		for (var i in this.tribes) {

			// If we are out of "good" islands, recreate the whole universe
			if (!homeIslands.length) {
				console.log( 'no more home island candidates' );
				return false;
			}

			// Select a random "good" island, make it home for one of the tribes,
			// remove it from the list of "good" islands
			var tribe = par.tribes[i];
			var index = rnd.between( 0, homeIslands.length-1 );
			var island = homeIslands[index];
			// All home islands are equal
			island.resource = null;
			island.size = Math.round( (Island.MIN_SIZE + Island.MAX_SIZE) / 20 ) * 10;
			tribe.addIsland( island, island.size / 2 );
			homeIslands.splice( index, 1 );

			// If any of the left "good" islands are too close to
			// the recently selected one, remove them from the list
			for (j=homeIslands.length-1; j >= 0; j--) {
				var isl = homeIslands[j];
				if (this.distance2( island, isl ) < 36 * Universe.MIN_DISTANCE2) {
					console.log( 'discarding home island candidate' );
					homeIslands.splice( j, 1 );
				}
			}
		}

		// It's the last thing to do, because want to be sure
		// that this version of the world is good enough
		for (var i in this.islands) {
			this.islands[i].buildMap();
		}

		return true;
	}

	this.add = function( island ) {
		this.islands.push( island );
		return island;
	};

	this.endTurn = function() {

		Universe.curTribe.state = Tribe.State.NOT_GROWN;

		if (this.curTribe == this.player) {
			gamelog.clear();
		}
		
		var i = this.tribes.indexOf( this.curTribe ) + 1;
		this.curTribe = this.tribes[i < this.tribes.length ? i : 0];

		if (this.curTribe == this.player) {
			this.turn++;
		}
	};

	this.time2sail = function( tribe, from, to ) {
		var dx = to.x - from.x;
		var dy = to.y - from.y;
		return Math.ceil( this.distance( from, to ) / tribe.sailSpeed );
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