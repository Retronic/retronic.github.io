function MigratePanel( game ) {
	IslandPanel.call( this, game );

	this.from = null;
	this.to = null;

	this.size = 0;
}

MigratePanel.prototype = Object.create( IslandPanel.prototype );
MigratePanel.prototype.constructor = MigratePanel;

MigratePanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

	this.header = new TextView( game, "Transfer", "font12", 12, "center" );
	this.header.color = 0xffff88;
	this.add( this.header );

	this.fromLabel = game.add.bitmapText( 0, 0, "font12", "From: ", 12, this );
	this.fromLabel.x = Panel.MARGIN;

	this.fromValue = game.add.bitmapText( 0, 0, "font12", "???", 12, this );
	this.fromValue.x = Panel.MARGIN;

	this.toLabel = game.add.bitmapText( 0, 0, "font12", "To: ", 12, this );
	this.toLabel.x = Panel.MARGIN;

	this.toValue = game.add.bitmapText( 0, 0, "font12", "???", 12, this );
	this.toValue.x = this.toLabel.x + this.toLabel.textWidth;

	this.time = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this.time.x = Panel.MARGIN;

	this.sizeInfo = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this.sizeInfo.x = Panel.MARGIN;

	this.ok = new RGButton( game, "OK" );
	this.ok.onClick.add( this.onOK, this );
	this.addChild( this.ok );

	this.cancel = new RGButton( game, "Cancel" );
	this.cancel.onClick.add( this.onCancel, this );
	this.addChild( this.cancel );
}

MigratePanel.prototype.layout = function() {

	IslandPanel.prototype.layout.call( this );

	this.header.resize( this.reqWidth, 0 );
	this.header.y = this.sectionTop + Panel.MARGIN;

	this.fromLabel.y = this.toLabel.y = this.header.bottom + Panel.MARGIN;
	this.fromValue.y = this.toValue.y = this.fromLabel.y + this.fromLabel.height;

	this.toLabel.x = this.toValue.x = this.reqWidth / 2; 

	this.sizeInfo.y = this.fromValue.y + this.fromValue.height + Panel.MARGIN
	this.time.y = this.sizeInfo.y + this.sizeInfo.height;

	this.cancel.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.cancel.x = (this.reqWidth - this.cancel.width) / 2;
	this.cancel.y = this.reqHeight - Panel.MARGIN - this.cancel.height;

	this.ok.resize( this.cancel.width, this.cancel.height );
	this.ok.x = this.cancel.x;
	this.ok.y = this.cancel.y - Panel.MARGIN - this.ok.height;
}

MigratePanel.prototype.onCancel = function() {
	scene.switchPanel( IslandMainPanel ).select( this.island );
}

MigratePanel.prototype.onOK = function() {

	game.add.audio( 'launch' ).play();

	var fleet = Universe.curTribe.launch( this.from.tribe, this.from, this.to, this.size );
	
	scene.switchPanel( FleetPanel ).select( fleet );
}

MigratePanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		this.select( object );
	}
}

MigratePanel.prototype.select = function( island ) {

	if (this.from) {
		this.to = (island != this.from && this.from.tribe.visibleIslands[island.id]) ? island : null;
	} else {
		this.from = island;

		this.fromValue.text = island.name;
		this.fromValue.tint = island.tribe ? island.tribe.color : 0xffffff;
	}

	if (this.to) {
		this.toValue.text = island.name;
		this.toValue.tint = island.tribe ? island.tribe.color : 0xffffff;

		this.ok.visible = true;

		if (!island.tribe) {
			this.ok.label = "Colonize";
		} else if (island.tribe == Universe.player) {
			this.ok.label = "Migrate";
		} else {
			this.ok.label = "Invade";
		}

	} else {
		this.toValue.text = '???';
		this.toValue.tint = 0xcccccc;

		this.ok.visible = false;
	}

	this.updateSize();
	this.updateDuration();

	IslandPanel.prototype.select.call( this, island );
	scene.map.link( this.from, this.to );
}

MigratePanel.prototype.updateSize = function() {
	if (this.from && this.to) {

		var limitFrom = Math.floor( this.from.population / 2);
		var limitTo = (this.to.tribe && this.to.tribe != this.from.tribe) ? this.to.size : Math.round( this.to.size - this.to.population );
		var limit = Math.min( limitFrom, limitTo );

		this.size = limit;

		this.sizeInfo.text = "Size: " + this.size;

	} else {

		this.size = 0;
		this.sizeInfo.text = "";

	}
}

MigratePanel.prototype.updateDuration = function() {
	if (this.from && this.to) {

		this.time.text = "Duration: " + Universe.time2sail( this.from.tribe, this.from, this.to ) + " turns";

	} else {
		this.time.text = "";
	}
}