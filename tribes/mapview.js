function MapView( game ) {

	// All IslandViews
	this.islands = {};

	// All fleets
	this.fleets = {};

	// Currently selected island
	this.selected = null;

	// "Camera" controlling tween
	this.tween = null;

	View.call( this, game );

	// The map doesn't select any islands when they get clicked,
	// it only dispatches this signal and the current pannel should
	// call MapView.select() (when it's appropriate)
	this.onClick = new Phaser.Signal();

	this.minx = 0;
	this.miny = 0;
	this.maxx = Universe.SIZE;
	this.maxy = Universe.SIZE;
}

MapView.prototype = Object.create( View.prototype );
MapView.prototype.constructor = MapView;

MapView.prototype.createChildren = function() {


	this.objects = game.add.group( this );

	this.ocean = game.add.tileSprite( 0, 0, 100, 100, 'ocean', null, this.objects );
	this.ocean.autoScroll( 8, 2 );

	this.ocean.mask = game.add.graphics( 0, 0, this.objects );

	this.graphics = game.add.graphics( 0, 0, this.objects );

	this.line = new DirLine( game );
	this.line.alpha = 0.3;
	this.objects.add( this.line );

	for (var i in Universe.islands) {
		var data = Universe.islands[i];

		island = new IslandView( game, data );
		island.onClick.add( this.onObjectClick, this );

		this.objects.add( island );
		this.islands[data.id] = island;
	}
}

MapView.prototype.layout = function() {

	this.zoom = Math.min( this.reqWidth, this.reqHeight ) / Universe.SIZE;

	this.ocean.x = -Universe.SIZE * this.zoom;
	this.ocean.y = -Universe.SIZE * this.zoom;
	this.ocean.width = Universe.SIZE * 3 * this.zoom;
	this.ocean.height = Universe.SIZE * 3 * this.zoom;

	var d = 2 * Universe.player.getViewDistance() * this.zoom;
	this.ocean.mask.clear();
	this.ocean.mask.beginFill( 0xffffff );

	var ox = (this.reqWidth - Universe.SIZE * this.zoom) / 2;
	var oy = (this.reqHeight - Universe.SIZE * this.zoom) / 2;
	for (var i in this.islands) {
		var island = this.islands[i];
		island.x = Math.floor( island.data.x * this.zoom );
		island.y = Math.floor( island.data.y * this.zoom );
		island.zoom = this.zoom;

		if (island.data.tribe == Universe.player) {
			this.ocean.mask.drawCircle( island.x, island.y, d );
		}
	}

	if (this.tween) {
		this.tween.stop();
	}
	this.objects.x = Math.floor( (this.reqWidth - (this.minx + this.maxx) * this.zoom) / 2 );
	this.objects.y = Math.floor( (this.reqHeight - (this.miny + this.maxy) * this.zoom) / 2 );

	for (i in this.fleets) {
		var fleet = this.fleets[i];
		fleet.refresh();
	}

	if (this.selected) {
		this.select( this.selected );
	}
}

MapView.prototype.select = function( object ) {

	this.graphics.clear();
	this.line.visible = false;

	if (object instanceof Island) {
		var island = this.islands[object.id];
		this.graphics.lineStyle( 4, 0xFFFFFF, 0.3 );
		this.graphics.drawCircle( island.x, island.y, Math.sqrt( Universe.MIN_DISTANCE2 ) * this.zoom );
	} else if (object instanceof Fleet && object.tribe == Universe.player) {
		this.line.draw( object.view, object.to.view );
	}

	this.selected = object;
}

MapView.prototype.link = function( island1, island2 ) {

	this.graphics.clear();
	this.graphics.lineStyle( 4, 0xFFFFFF, 0.3 );
	this.line.visible = false;

	var r = Math.sqrt( Universe.MIN_DISTANCE2 ) * this.zoom;

	if (island1) {
		var isl1 = this.islands[island1.id];
		this.graphics.drawCircle( isl1.x, isl1.y, r );
	}
	if (island2) {
		var isl2 = this.islands[island2.id];
		this.graphics.drawCircle( isl2.x, isl2.y, r );
	}
	if (island1 && island2) {
		this.line.draw( isl1, isl2, r/2 + 2 );
	}
}

MapView.prototype.onObjectClick = function( object ) {
	this.onClick.dispatch( object.data );
}

MapView.prototype.addFleet = function( fleet ) {
	var view = new FleetView( game, fleet );
	this.fleets[fleet.id] = view;
	this.objects.add( view );

	view.onClick.add( this.onObjectClick, this );
}

MapView.prototype.updateFieldOfView = function( tribe ) {

	var d = 2 * Universe.player.getViewDistance() * this.zoom;

	this.ocean.mask.clear();
	this.ocean.mask.beginFill( 0xffffff );
	for (var i in tribe.islands) {
		var island = tribe.islands[i].view;
		this.ocean.mask.drawCircle( island.x, island.y, d );
	}

	for (i in tribe.knownIslands) {
		var view = tribe.knownIslands[i].view;
		if (!view.visible) {
			view.alpha = 0;
			view.visible = true;
			game.add.tween( view ).to( {alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true );
		}
	}
	this.adjustWindow( tribe );
}

MapView.prototype.adjustWindow = function( tribe ) {
	var minx = Number.POSITIVE_INFINITY;
	var miny = Number.POSITIVE_INFINITY;
	var maxx = Number.NEGATIVE_INFINITY;
	var maxy = Number.NEGATIVE_INFINITY;

	for (var i in tribe.knownIslands) {
		var island = tribe.knownIslands[i];
		if (island.x < minx) {
			minx = island.x;
		}
		if (island.x > maxx) {
			maxx = island.x;
		}
		if (island.y < miny) {
			miny = island.y;
		}
		if (island.y > maxy) {
			maxy = island.y;
		}
	}

	if (minx != this.minx || miny != this.miny || maxx != this.maxx || maxy != this.maxy) {

		this.minx = minx;
		this.miny = miny;
		this.maxx = maxx;
		this.maxy = maxy;

		if (this.tween) {
			this.tween.stop();
		}
		var cx = Math.floor( (this.reqWidth - (this.minx + this.maxx) * this.zoom) / 2 );
		var cy = Math.floor( (this.reqHeight - (this.miny + this.maxy) * this.zoom) / 2 );
		this.tween = game.add.tween( this.objects ).to( {x: cx, y: cy}, 1000, Phaser.Easing.Quadratic.InOut, true );
	}
}