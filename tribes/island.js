
function Island( x, y, params ) {

	this.id = Universe.id();

	this.x = x;
	this.y = y;

	params = params || {};
	this.name		= params.name || '';
	this.size		= Math.round( params.size / 10 ) * 10 || Island.MIN_SIZE;
	this.population	= params.population || 0;
	this.resource	= params.resource || null;

	this.tribe = null;
	this.buildings = [];

	this.curTask = null;

	this.onChanged = new Phaser.Signal();

	this.land = null;
	this.shore = null;

//	this.buildMap();
}

Island.MIN_SIZE = 20;
Island.MAX_SIZE = 120;

Island.Resources = {
	WHEAT	: "wheat",		// Faster growth
	STONE	: "stone",		// Faster construction
	CLIFFS 	: "cliffs",		// Stronger in defense
	RUINS 	: "ruins",		// Large scince output
	TIMBER	: "timber"		// Faster shipbuilding
}

Island.MAP_SIZE	= 40;
Island.BMP_SIZE	= 256;

Island.prototype.grow = function() {

	if (this.tribe) {
		this.tribe.gold += this.getEarnings();
		this.tribe.progress += this.getScience();
	}
	
	var changed = false;

	if (this.population && this.has( Buildings.OUTPOST )) {
		var grow = this.population * 0.02 * Math.sqrt( 1 - this.population / this.size );
		if (this.resource == Island.Resources.WHEAT) {
			grow *= 1.5;
		}
		var newPop = Math.min( this.population + grow, this.size );
		if (newPop != this.population) {
			this.population = newPop;
			changed = true;
		}
	}

	if (this.curTask) {
		this.curTask.progress += this.getProduction();
		if (this.curTask.progress >= Buildings[this.curTask.name].cost) {
			if (this.tribe == Universe.player) {
				gamelog.message( 1, this.name + ' has completed ' + this.curTask.name, function() {
					scene.switchPanel( IslandMainPanel ).select( this );
				}, this );
			}
			this.buildings.push( this.curTask.name );
			this.curTask = null;
		}
		changed = true;
	}

	if (changed) {
		this.onChanged.dispatch();
	}
}

Island.prototype.buildMap = function() {

	this.map = [];
	for (var i=0; i < Island.MAP_SIZE; i++) {
		var row = [];
		for (var j=0; j < Island.MAP_SIZE; j++) {
			row.push( 0 );
		}
		this.map.push( row );
	}

	var MS = Island.MAP_SIZE - 2;

	var c = Math.floor( Island.MAP_SIZE / 2 );
	this.map[c][c] = 1;
	for (var i=0; i < this.size / Island.MIN_SIZE; i++) {
		var x = Math.floor(Island.gauss() * MS) + 1;
		var y = Math.floor(Island.gauss() * MS) + 1;
		this.map[y][x] = 1;
	}

	var square = 0;
	var limit = MS * MS / 4 * this.size / Island.MAX_SIZE;
	do {
		var x = Math.floor(Island.gauss() * MS) + 1;
		var y = Math.floor(Island.gauss() * MS) + 1;
		if (this.map[y][x]) {
			continue;
		}

		var count =0;
		if (this.map[y-1][x]) {
			count++;
		}
		if (this.map[y+1][x]) {
			count++;
		}
		if (this.map[y][x-1]) {
			count++;
		}
		if (this.map[y][x+1]) {
			count++;
		}

		// Square root for less jagged coastline
		if (Math.sqrt(Math.random()) * 4 < count) {
			this.map[y][x] = 1;
			square++;
		}

	} while (square < limit);

	var bmp = game.add.bitmapData( Island.MAP_SIZE, Island.MAP_SIZE, Universe.id() );
	for (var i=0; i < Island.MAP_SIZE; i++) {
		for (var j=0; j < Island.MAP_SIZE; j++) {
			if (this.map[i][j]) {
				bmp.setPixel( j, i, 0xff, 0xff, 0xff, false );
			}
		}
	}
	bmp.context.putImageData( bmp.imageData, 0, 0 );

	this.land = game.add.renderTexture( Island.BMP_SIZE, Island.BMP_SIZE );
	this.shore = game.add.renderTexture( Island.BMP_SIZE, Island.BMP_SIZE );

	var image = new Phaser.Image( game, 0, 0, bmp );
	image.smoothed = false;
	image.anchor.set( 0.5, 0.5 );
	image.x = image.y = Island.BMP_SIZE / 2;
	image.pivot.set( 0.5, 0.5 );
	image.angle = Math.random() * 360;
	var zoom = Island.BMP_SIZE / Island.MAP_SIZE / Math.SQRT2
	image.scale.set( zoom, zoom );
	image.updateTransform();
	this.land.render( image );

	image.x -= zoom;
	image.updateTransform();
	this.shore.render( image );
	image.x += 2*zoom;
	image.updateTransform();
	this.shore.render( image );
	image.x -= zoom;
	image.y -= zoom;
	image.updateTransform();
	this.shore.render( image );
	image.y += 2*zoom;
	image.updateTransform();
	this.shore.render( image );
}

Island.prototype.colonize = function( tribe, size ) {

	tribe.addIsland( this, size );

	this.curTask = {
		name		: Buildings.OUTPOST,
		progress	: 0
	}

	if (tribe == Universe.player) {
		gamelog.message( 2, this.name + ' has been colonized', function() {
			scene.switchPanel( IslandMainPanel ).select( this );
		}, this );
	}
}

Island.prototype.has = function( building ) {
	return this.buildings && this.buildings.indexOf( building ) != -1;
}

Island.prototype.canLaunch = function() {
	return this.population >= 2 && this.has( Buildings.SHIPYARD ) && !this.launched;
}

Island.prototype.getProduction = function() {
	var prod = Math.floor( this.population );
	if (this.resource == Island.Resources.STONE) {
		prod *= 0.5;
	}
	return prod;
}

Island.prototype.getEarnings = function() {
	var earnings = Math.floor( this.population );
	return earnings;
}

Island.prototype.getScience = function() {
	var science = Math.floor( this.population * this.population / this.size );
	return science;
}

Island.randomName = function() {
	// Auskerry Arran Bressay Berneray Ceallasigh Carna Danna Davaar Eriska Eorsa Fara Flodday Gigha Grimsay Hunda Hirta Innis Iona Jura 
	// Kirkibost Lunga Lismore Mingulay Muckle Oronsay Pabay Ronay Samphrey Swona Shillay Tiree Tanera Ulva Vementry Whalsay Wyre
	var a = ['Aus','Ar','Bres','Ber','Ce','Car','Dan','Da','E','E','Fa','Flod','Gig','Grim','Hun','Hir','In','I','Ju',
		'Kir','Lun','Lis','Min','Muck','O','Pa','Ro','Sam','Swo','Shil','Ti','Ta','Ul','Ve','Whal','Wy'];
	var b = ['ker','ne','al','la','va','ris','or','o','ki','mo','gu','ron','ne','men'];
	var c = ['ry','ran','say','ray','sigh','na','na','ar','ka','sa','ra','day','ha','say','da','ta','nis','na','ra',
		'bost','ga','re','lay','le','say','bay','nay','phrey','na','lay','ree','ra','va','try','say','re'];
	var l = [3, 2, 3, 3, 4, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2];
	var n = l[Math.floor(Math.random() * l.length)] - 2;
	var name = a[Math.floor(Math.random() * a.length)];
	for (var i=0; i < n; i++) {
		name += b[Math.floor(Math.random() * b.length)];
	}
	name += c[Math.floor(Math.random() * c.length)];
	return name;
}

Island.gauss = function() {
	return (Math.random() + Math.random() + Math.random()) / 3;
}