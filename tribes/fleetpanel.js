function FleetPanel( game ) {
	View.call( this, game );

	this.fleet = null;
}

FleetPanel.prototype = Object.create( View.prototype );
FleetPanel.prototype.constructor = FleetPanel;

FleetPanel.prototype.destroy = function() {
	if (this.fleet) {
		this.fleet.onChanged.remove( this.onFleetChanged, this );
	}

	View.prototype.destroy.call( this );
}

FleetPanel.prototype.createChildren = function() {

	this.bg = game.add.graphics( 0, 0, this );

	this.ocean = game.add.tileSprite( 0, 0, 100, 100, 'ocean', null, this );
	this.ocean.autoScroll( 12, 12 );

	this.name = game.add.bitmapText( 10, 10, "font12", "", 12, this );
	this.size = game.add.bitmapText( 10, 10, "font12", "", 12, this );

	this.fromTo = new FromTo( game );
	this.addChild( this.fromTo );

	this.time = game.add.bitmapText( 10, 10, "font12", "", 12, this );

	this.endTurn = new RGButton( game, "End Turn" );
	this.endTurn.onClick.add( Universe.endTurn, Universe );
	this.addChild( this.endTurn );
}

FleetPanel.prototype.layout = function() {

	this.name.x = Math.floor( (this.width - this.name.width) / 2 );

	this.size.x = Math.floor( (this.width - this.size.width) / 2 );
	this.size.y = this.name.y + this.name.height;

	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 2, 2, this.reqWidth-4, this.reqHeight-4 );
	var m = this.reqWidth-20;
	var p = this.size.y + this.name.textHeight + 10;
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 10, p, m, m );

	this.ocean.x = 12;
	this.ocean.y = p+2;
	this.ocean.width = m-4;
	this.ocean.height = m-4;

	if (this.image) {
		this.image.x = this.reqWidth / 2;
		this.image.y = p + m/2;
		this.image.scale.setTo( 3, 3 );
	}

	this.fromTo.resize( this.reqWidth, 0 );
	this.fromTo.y = p + m + 10;

	this.time.x = 10;
	this.time.y = this.fromTo.bottom + 10;

	this.endTurn.resize( this.reqWidth - 20, 30 );
	this.endTurn.x = (this.reqWidth - this.endTurn.width) / 2;
	this.endTurn.y = this.reqHeight - 10 - this.endTurn.height;
}

FleetPanel.prototype.mapClicked = function( object ) {
	if (object instanceof Fleet) {
		this.select( object );
	} else if (object instanceof Island) {
		oceanTribes.switchPanel( IslandPanel ).select( object );
	}
}

FleetPanel.prototype.select = function( fleet, refresh ) {

	if (fleet == this.fleet && !refresh) {
		return;
	}

	if (this.fleet) {
		this.fleet.onChanged.remove( this.onFleetChanged, this );
		this.remove( this.image );
	}

	this.fleet = fleet;
	this.fleet.onChanged.add( this.onFleetChanged, this );

	this.name.text = fleet.tribe.name + ' fleet';
	this.name.tint = fleet.tribe.color;

	this.size.text = "size: " + fleet.size;

	var dx = fleet.from.view.x - fleet.to.view.x;
	var dy = fleet.from.view.y - fleet.to.view.y;
	var d = Math.sqrt( dx * dx + dy * dy );
	this.ocean.autoScroll( dx / d * 20, dy / d * 20 );

	this.image = game.add.image( 0, 0, fleet.view.button.texture, null, this );
	this.image.anchor.setTo( 0.5, 0.5 );

	if (fleet.tribe == Universe.player) {
		this.fromTo.from = fleet.from;
		this.fromTo.to = fleet.to;

		this.time.text = "Will arrive in " + (fleet.duration - fleet.progress) + " turns";
	} else {
		this.fromTo.from = null;
		this.fromTo.to = null;

		this.time.text = "";
	}

	this.layout();

	oceanTribes.map.select( fleet );
}

FleetPanel.prototype.onFleetChanged = function() {
	this.select( this.fleet, true );
	if (!this.fleet.progress.isAlive) {
		oceanTribes.switchPanel( IslandPanel );
		oceanTribes.map.onClick.dispatch( this.fleet.to );
	}
}