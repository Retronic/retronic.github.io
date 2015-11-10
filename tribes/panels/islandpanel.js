function IslandPanel( game ) {
	Panel.call( this, game );

	this.island = null;
}

IslandPanel.prototype = Object.create( Panel.prototype );
IslandPanel.prototype.constructor = IslandPanel;

IslandPanel.prototype.destroy = function() {
	if (this.island) {
		this.island.onChanged.remove( this.onIslandChanged, this );
	}

	View.prototype.destroy.call( this );
}

IslandPanel.prototype.createChildren = function() {

	Panel.prototype.createChildren.call( this );

	this.ocean = game.add.tileSprite( 0, 0, 100, 100, 'ocean', null, this );
	this.ocean.autoScroll( 8, 2 );

	this.image = game.add.group( this );

	this.name = new TextView( game, '', 'font12', 12, 'center' );
	this.name.y = Panel.MARGIN;
	this.add( this.name );

	this.flotilla = game.add.image( 0, 0, 'ship', null, this );
	this.flotilla.anchor.set( 0.5, 0.5 );
	this.flotilla.smoothed = false;

	this.info = game.add.bitmapText( 0, 0, "font8", "", 8, this );
	this.info.smoothed = false;
	this.info.align = 'right';

	this.buildingsList = game.add.bitmapText( 0, 0, "font8", "", 8, this );
}

IslandPanel.prototype.layout = function() {

	Panel.prototype.layout.call( this );

	this.name.resize( this.reqWidth, 0 );

	var m = this.reqWidth - Panel.MARGIN*2;
	var p = this.name.bottom + Panel.MARGIN;
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( Panel.MARGIN, p, m, m );
	this.sectionTop = p + m;

	this.ocean.x = Panel.MARGIN + Panel.LINE;
	this.ocean.y = p + Panel.LINE;
	this.ocean.width =
	this.ocean.height = 
		m - Panel.LINE*2;

	this.image.x = this.reqWidth / 2;
	this.image.y = p + m/2;
	var zoom = this.ocean.width / Island.BMP_SIZE / Math.SQRT2;
	this.image.scale.setTo( zoom, zoom );

	this.flotilla.x = this.image.x + m / 4;
	this.flotilla.y = this.image.y + m / 4;

	this.info.x = this.reqWidth - this.info.textWidth - Panel.MARGIN - Panel.LINE*2;
	this.info.y = p + m - Panel.LINE*2 - this.info.textHeight;

	this.buildingsList.x = Panel.MARGIN + Panel.LINE*2;
	this.buildingsList.y = p + Panel.LINE*2;
}

IslandPanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		this.select( object );
	} else if (object instanceof Fleet) {
		scene.switchPanel( FleetPanel ).select( object );
	}
}

IslandPanel.prototype.select = function( island, refresh ) {

	if (island == this.island && !refresh) {
		return;
	}

	if (this.island) {
		this.island.onChanged.remove( this.onIslandChanged, this );
		this.image.removeAll();
	}

	this.island = island;
	this.island.onChanged.add( this.onIslandChanged, this );

	if (island.tribe) {
		this.name.text = island.name + '\n' + island.tribe.name + ': ' + Math.round(island.population) + '/' + island.size;
		this.name.color = island.tribe.color;
	} else {
		this.name.text = island.name + '\n' + 'Uninhabited: 0/' + island.size;
		this.name.color = 0xFFFFFF;
	}

	this.info.text = island.resource ? island.resource : "";

	this.buildingsList.text = island.buildings.join( '\n' );

	this.shore = game.add.image( 0, 0, this.island.shore, null, this.image );
	this.shore.anchor.setTo( 0.5, 0.5 );
	this.shore.pivot.setTo( 0.5, 0.5 );
	this.shore.tint = this.island.view.shore.tint;

	this.land = game.add.image( 0, 0, this.island.land, null, this.image );
	this.land.anchor.setTo( 0.5, 0.5 );
	this.land.pivot.setTo( 0.5, 0.5 );
	this.land.tint = this.island.view.button.tint;

	this.image.rotation = island.rotation;

	this.flotilla.visible = island.tribe == Universe.player && island.ship;
	if (island.tribe) {
		this.flotilla.frame = island.tribe.flag;
	}

	this.layout();

	scene.map.select( island );
}

IslandPanel.prototype.onIslandChanged = function() {
	this.select( this.island, true );
}