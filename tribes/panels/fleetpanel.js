function FleetPanel( game ) {
	Panel.call( this, game );

	this.fleet = null;

	this.enter = game.input.keyboard.addKey( Phaser.Keyboard.ENTER );
	this.enter.onDown.add( Universe.endTurn, Universe );

	this.esc = game.input.keyboard.addKey( Phaser.Keyboard.ESC );
	this.esc.onDown.add( this.selectHome, this );
}

FleetPanel.prototype = Object.create( Panel.prototype );
FleetPanel.prototype.constructor = FleetPanel;

FleetPanel.prototype.destroy = function() {

	this.enter.onDown.remove( Universe.endTurn, Universe );
	this.esc.onDown.remove( this.selectHome, this );

	if (this.fleet) {
		this.fleet.onChanged.remove( this.onFleetChanged, this );
	}

	View.prototype.destroy.call( this );
}

FleetPanel.prototype.createChildren = function() {

	Panel.prototype.createChildren.call( this );

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

	Panel.prototype.layout.call( this );

	var m = this.reqWidth - Panel.MARGIN*2;
	var p = this.size.y + this.name.textHeight + Panel.MARGIN;
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( Panel.MARGIN, p, m, m );

	this.ocean.x = Panel.MARGIN + Panel.LINE;
	this.ocean.y = p + Panel.LINE;
	this.ocean.width = m - Panel.LINE*2;
	this.ocean.height = m - Panel.LINE*2;

	if (this.image) {
		this.image.x = this.reqWidth / 2;
		this.image.y = p + m/2;
		this.image.scale.setTo( 3, 3 );
	}

	this.fromTo.resize( this.reqWidth - Panel.MARGIN*2, 0 );
	this.fromTo.x = Panel.MARGIN;
	this.fromTo.y = p + m + Panel.MARGIN;

	this.time.x = 10;
	this.time.y = this.fromTo.bottom + Panel.MARGIN;

	this.endTurn.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.endTurn.x = (this.reqWidth - this.endTurn.width) / 2;
	this.endTurn.y = this.reqHeight - Panel.MARGIN - this.endTurn.height;
}

FleetPanel.prototype.mapClicked = function( object ) {
	if (object instanceof Fleet) {
		this.select( object );
	} else if (object instanceof Island) {
		scene.switchPanel( IslandMainPanel ).select( object );
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

	this.name.text = fleet.tribe.name + (fleet.seige ? " seige flotilla" : " flotilla");
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

	scene.map.select( fleet );
}

FleetPanel.prototype.onFleetChanged = function() {
	this.select( this.fleet, true );
	if (!this.fleet.isAlive) {
		scene.switchPanel( IslandMainPanel ).select( this.fleet.to );
	}
}

FleetPanel.prototype.selectHome = function() {
	scene.switchPanel( IslandMainPanel ).select( this.fleet.from );
}