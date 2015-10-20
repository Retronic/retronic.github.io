Phaser.Plugin.Perlin = function( seed ) {
	this.init( seed );
};

Phaser.Plugin.Perlin.prototype = {

	permutation: [ 
		151,160,137,91,90,15,                 
	    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
	],

	init: function( seed ) {
		this.p = new Array( 512 );
		for (var i=0; i < 256; i++) {
			this.p[i] = this.p[i+256] = this.permutation[(i + seed) % 256];
		}


		if (!this.ease) {
			this.ease = new Array( 256 );
		}
		for (var i=0; i < 256; i++) {
			var t = i / 256;
			this.ease[i] = t * t * t * (t * (6 * t - 15) + 10);
		}
	},

	dot: function( hash, x, y ) {
		switch (hash & 3) {
		case 0: return +x +y;
		case 1: return +x -y;
		case 2: return -x +y;
		case 3: return -x -y;
		}
	},

	interpolate: function( a, b, w ) {
		return a + (b - a) * w;
	},

	noiseMap: function( width, height, gridSize ) {

		var grid = new Array( width * height );
		var index = 0;

		var xStep = gridSize / width;
		var yStep = gridSize / height;

		var y = 0;
		for (var i=0; i < height; i++, y += yStep) {

			var i0 = Math.floor( y );
			var i1 = i0 + 1;

			var fy = y - i0; 
			var wy = this.ease[Math.floor(fy * 256)];

			var x = 0;
			for (var j=0; j < width; j++, x += xStep) {

				var j0 = Math.floor( x );
				var j1 = j0 + 1;

				var fx = x - j0; 
				var wx = this.ease[Math.floor(fx * 256)];

				var aa = this.p[this.p[j0]+i0];
				var ab = this.p[this.p[j1]+i0];
				var ba = this.p[this.p[j0]+i1];
				var bb = this.p[this.p[j1]+i1];

				var v0 = this.dot( aa, fx, fy );
				var v1 = this.dot( ab, fx - 1, fy );
				var val0 = this.interpolate( v0, v1, wx );
				var v0 = this.dot( ba, fx, fy - 1 );
				var v1 = this.dot( bb, fx - 1, fy - 1 );
				var val1 = this.interpolate( v0, v1, wx );

				grid[index++] = this.interpolate( val0, val1, wy );
			}
		}

		return grid;
	},

	noise: function( x, y, gridSize ) {

		var j0 = Math.floor( x );
		var j1 = j0 + 1;

		var fx = x - j0; 
		var wx = this.ease[Math.floor(fx * 256)];

		var i0 = Math.floor( y );
		var i1 = i0 + 1;

		var fy = y - i0; 
		var wy = this.ease[Math.floor(fy * 256)];

		var aa = this.p[this.p[j0]+i0];
		var ab = this.p[this.p[j1]+i0];
		var ba = this.p[this.p[j0]+i1];
		var bb = this.p[this.p[j1]+i1];

		var v0 = this.dot( aa, fx, fy );
		var v1 = this.dot( ab, fx - 1, fy );
		var val0 = this.interpolate( v0, v1, wx );
		var v0 = this.dot( ba, fx, fy - 1 );
		var v1 = this.dot( bb, fx - 1, fy - 1 );
		var val1 = this.interpolate( v0, v1, wx );

		return this.interpolate( val0, val1, wy );
	},

	noiseMapHigh: function( width, height, gridSize, octaves, persistance ) {

		var result = this.noiseMap( width, height, gridSize );

		if (persistance == undefined) {
			persistance = 0.5;
		}

		for (var k=0, amplitude=persistance; k < octaves; k++, amplitude*=persistance) {
			var o = this.noiseMap( width, height, gridSize*=2 );
			for (var l=0; l < result.length; l++) {
				result[l] += (o[l] * amplitude);
			}
		}
		return result;
	},

	noiseHigh: function( x, y, gridSize, octaves, persistance ) {

		var result = this.noise( x, y, gridSize );

		if (persistance == undefined) {
			persistance = 0.5;
		}

		for (var k=0, amplitude=persistance; k < octaves; k++, amplitude*=persistance) {
			result += (this.noise( x, y, gridSize*=2 ) * amplitude);
		}
		return result;
	}
}