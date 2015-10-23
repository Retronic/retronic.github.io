function MigratePanel( game ) {
	IslandPanel.call( this, game );

	this.originSet = null;
}

MigratePanel.prototype = Object.create( IslandPanel.prototype );
MigratePanel.prototype.constructor = MigratePanel;

MigratePanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

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

	IslandPanel.prototype.layout.call( this );

	this.fromTo.resize( this.reqWidth - Panel.MARGIN*2, 0 );
	this.fromTo.x = Panel.MARGIN;
	this.fromTo.y = this.sectionTop + Panel.MARGIN;

	this.size.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.size.x = Panel.MARGIN;
	this.size.y = this.fromTo.bottom + Panel.MARGIN;

	this.time.x = Panel.MARGIN;
	this.time.y = this.size.bottom + Panel.MARGIN*2;

	this.cancel.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.cancel.x = (this.reqWidth - this.cancel.width) / 2;
	this.cancel.y = this.reqHeight - Panel.MARGIN - this.cancel.height;

	this.ok.resize( this.cancel.width, this.cancel.height );
	this.ok.x = this.cancel.x;
	this.ok.y = this.cancel.y - Panel.MARGIN - this.ok.height;
}

MigratePanel.prototype.onCancel = function() {
	oceanTribes.switchPanel( IslandMainPanel ).select( this.fromTo.from );
}

MigratePanel.prototype.onOK = function() {
	var fleet = Universe.curTribe.launch( this.fromTo.from.tribe, this.fromTo.from, this.fromTo.to, this.size.value );
	
	oceanTribes.switchPanel( FleetPanel ).select( fleet );
}

MigratePanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		this.fromTo.to = object;
		this.updateLink();
	}
}

MigratePanel.prototype.select = function( island ) {

	IslandPanel.prototype.select.call( this, island );
	this.fromTo.from = island;

	this.size.setRange( 1, Math.floor(island.population / 2), Math.floor(island.population / 2) );

	this.updateLink();
}

MigratePanel.prototype.updateLink = function() {

	var from = this.fromTo.from;
	var to = this.fromTo.to;

	this.ok.visible = 
	this.time.visible = false;

	if (from && to) {
		this.time.text = "Time to sail: " + Universe.time2sail( from.tribe, from, to ) + " turns";
		if (to.tribe == null) {
			this.ok.label = "Colonize";
		} else if (to.tribe == from.tribe) {
			this.ok.label = "Migrate";
		} else {
			this.ok.label = "Invade";
		}

		var limitFrom = Math.floor(from.population / 2);
		var limitTo = to.tribe ?
			(to.has( Buildings.GARRISON ) ? Math.round( to.size - to.population ) : 0) : 1;
		var limit = Math.min( limitFrom, limitTo );

		this.size.setRange( 1, limit, limit );
		if (limit >= 1) {
			this.ok.visible = 
			this.time.visible = true;
		}
	}

	oceanTribes.map.link( from, to );
}