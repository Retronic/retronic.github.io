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

	this.name = game.add.bitmapText( 0, Panel.MARGIN, "font12", "", 12, this );
	this.name.smoothed = false;
	this.name.align = 'center';

	this.info = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this.info.smoothed = false;
}

IslandPanel.prototype.layout = function() {

	Panel.prototype.layout.call( this );

	this.name.x = Math.floor( (this.width - this.name.width) / 2 );

	var m = this.reqWidth - Panel.MARGIN*2;
	var p = this.name.y + this.name.textHeight + Panel.MARGIN;
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( Panel.MARGIN, p, m, m );
	this.bg.beginFill( 0x003344 );
	this.bg.drawRect( Panel.MARGIN + Panel.LINE, p + Panel.LINE, m - Panel.LINE*2, m - Panel.LINE*2 );

	if (this.image) {
		this.image.x = this.reqWidth / 2;
		this.image.y = p + m/2;
		this.image.scale.setTo( 5, 5 );
	}

	this.info.x = (this.reqWidth - this.info.textWidth) / 2;
	this.info.y = p + m + Panel.MARGIN;
}

IslandPanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		this.select( object );
	} else if (object instanceof Fleet) {
		oceanTribes.switchPanel( FleetPanel ).select( object );
	}
}

IslandPanel.prototype.select = function( island, refresh ) {

	if (island == this.island && !refresh) {
		return;
	}

	if (this.island) {
		this.island.onChanged.remove( this.onIslandChanged, this );
		this.remove( this.image );
	}

	this.island = island;
	this.island.onChanged.add( this.onIslandChanged, this );

	if (island.tribe) {
		this.name.text = island.name + '\n' + island.tribe.name + ': ' + Math.round(island.population) + '/' + island.size;
		this.name.tint = island.tribe.color;
	} else {
		this.name.text = island.name + '\n' + 'Uninhabited: 0/' + island.size;
		this.name.tint = 0xFFFFFF;
	}

	var type = [];
	if (island.fertility == Island.FERTILE) {
		type.push( "fertile" );
	} else if (island.fertility == Island.BARREN) {
		type.push( "barren" );
	}
	if (island.minerals == Island.RICH) {
		type.push( "mineral rich" );
	} else if (island.minerals == Island.POOR) {
		type.push( "mineral poor" );
	}
	this.info.text = type.join( ', ' ) || 'normal';

	this.image = game.add.image( 0, 0, this.island.view.button.texture, null, this );
	this.image.anchor.setTo( 0.5, 0.5 );
	this.image.pivot.setTo( 0.5, 0.5 );
	this.image.angle = this.island.view.button.angle;
	this.image.tint = this.island.view.button.tint;

	this.layout();

	oceanTribes.map.select( island );
}

IslandPanel.prototype.onIslandChanged = function() {
	this.select( this.island, true );
}