function MigratePanel( game ) {
	View.call( this, game );

	this.originSet = null;
}

MigratePanel.prototype = Object.create( View.prototype );
MigratePanel.prototype.constructor = MigratePanel;

MigratePanel.prototype.createChildren = function() {

	this.bg = game.add.graphics( 0, 0, this );

	this.fromTo = new FromTo( game );
	this.addChild( this.fromTo );

	this.time = game.add.bitmapText( 0, 0, "font12", "Time to sail: ???", 12, this );

	this.size = new RangeValue( game );
	this.add( this.size );

	this.ok = new RGButton( game, "OK" );
	this.ok.onClick.add( this.onOK, this );
	this.addChild( this.ok );

	this.cancel = new RGButton( game, "Cancel" );
	this.cancel.onClick.add( this.onCancel, this );
	this.addChild( this.cancel );
}

MigratePanel.prototype.layout = function() {

	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 2, 2, this.reqWidth-4, this.reqHeight-4 );

	this.fromTo.resize( this.reqWidth, 0 );

	this.size.resize( this.reqWidth - 20, 30 );
	this.size.x = 10;
	this.size.y = this.fromTo.bottom + 10;

	this.time.x = 10;
	this.time.y = this.size.bottom + 20;

	this.cancel.resize( this.reqWidth - 20, 30 );
	this.cancel.x = (this.reqWidth - this.cancel.width) / 2;
	this.cancel.y = this.reqHeight - 10 - this.cancel.height;

	this.ok.resize( this.cancel.width, this.cancel.height );
	this.ok.x = this.cancel.x;
	this.ok.y = this.cancel.y - 10 - this.ok.height;
}

MigratePanel.prototype.onCancel = function() {
	oceanTribes.switchPanel( IslandPanel );
	oceanTribes.map.onClick.dispatch( this.originSet ? this.fromTo.from : this.fromTo.to );
}

MigratePanel.prototype.onOK = function() {
	var fleet = Universe.curTribe.launch( this.fromTo.from.tribe, this.fromTo.from, this.fromTo.to, this.size.value );
	
	oceanTribes.switchPanel( FleetPanel );
	oceanTribes.map.onClick.dispatch( fleet );
}

MigratePanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		if (this.originSet) {
			this.migrateTo( object );
		} else {
			this.migrateFrom( object.tribe == Universe.player ? object : null );
		}
	}
}

MigratePanel.prototype.migrateFrom = function( island ) {
	this.fromTo.from = island;

	if (this.originSet == null) {
		this.originSet = true;
		this.size.setRange( 1, Math.floor(island.population / 2), Math.floor(island.population / 2) );
	}

	this.updateLink();
}

MigratePanel.prototype.migrateTo = function( island ) {
	this.fromTo.to = island;

	if (this.originSet == null) {
		this.originSet = false;
		this.size.setRange( 1, island.size, island.size );
	}

	this.updateLink();
}

MigratePanel.prototype.updateLink = function() {

	var from = this.fromTo.from;
	var to = this.fromTo.to;

	this.ok.visible = 
	this.time.visible = 
		from && to;

	if (this.ok.visible) {
		this.time.text = "Time to sail: " + Universe.time2sail( from.tribe, from, to ) + " turns";
		if (to.tribe == null) {
			this.ok.label = "Colonize";
		} else if (to.tribe == from.tribe) {
			this.ok.label = "Migrate";
		} else {
			this.ok.label = "Invade";
		}

		this.size.setRange( 1, Math.min( Math.floor(from.population / 2), to.size ), this.size.value );
	}

	oceanTribes.map.link( from, to );
}