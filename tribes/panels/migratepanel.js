function MigratePanel( game ) {
	IslandPanel.call( this, game );

	this.originSet = null;
}

MigratePanel.prototype = Object.create( IslandPanel.prototype );
MigratePanel.prototype.constructor = MigratePanel;

MigratePanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

	this.header = new TextView( game, "Transfer", "font12", 12, "center" );
	this.header.color = 0xffff88;
	this.add( this.header );

	this.toLabel = game.add.bitmapText( 0, 0, "font12", "To: ", 12, this );
	this.toLabel.x = Panel.MARGIN;

	this.toValue = game.add.bitmapText( 0, 0, "font12", "???", 12, this );
	this.toValue.x = this.toLabel.x + this.toLabel.textWidth;

	this.time = game.add.bitmapText( 0, 0, "font12", "", 12, this );

	this.size = new RangeValue( game );
	this.size.onChanged.add( function() {
		this.updateCost();
		this.updateOK();
	}, this );
	this.size.visible = false;
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

	this.header.resize( this.reqWidth, 0 );
	this.header.y = this.sectionTop + Panel.MARGIN;

	this.toLabel.y = this.toValue.y = this.header.bottom + Panel.MARGIN;

	this.size.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.size.x = Panel.MARGIN;
	this.size.y = this.toLabel.y + this.toLabel.textHeight + Panel.MARGIN*2;

	this.time.x = this.reqWidth - Panel.MARGIN - this.time.textWidth;
	this.time.y = this.toValue.y;

	this.cancel.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.cancel.x = (this.reqWidth - this.cancel.width) / 2;
	this.cancel.y = this.reqHeight - Panel.MARGIN - this.cancel.height;

	this.ok.resize( this.cancel.width, this.cancel.height );
	this.ok.x = this.cancel.x;
	this.ok.y = this.cancel.y - Panel.MARGIN - this.ok.height;
	this.ok.visible = false;
}

MigratePanel.prototype.onCancel = function() {
	scene.switchPanel( IslandMainPanel ).select( this.island );
}

MigratePanel.prototype.onOK = function() {

	game.add.audio( 'launch' ).play();

	var fleet = Universe.curTribe.launch( this.island.tribe, this.island, this.to, this.size.value, this.fleetType );
	
	scene.switchPanel( FleetPanel ).select( fleet );
}

MigratePanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		if (object == this.island) {
			this.to = null;
			this.fleetType = null;
		} else {
			this.to = object;
			if (!object.tribe) {
				this.fleetType = Fleet.SETTLER;
			} else if (object.tribe == Universe.player) {
				this.fleetType = Fleet.TRANSPORT;
			} else {
				this.fleetType = Fleet.NAVAL;
			}
		}
		if (this.to) {
			this.toValue.text = object.name;
			this.toValue.tint = object.tribe ? object.tribe.color : 0xffffff;

			this.time.text = Universe.time2sail( this.island.tribe, this.island, this.to ) + ' turns';
			this.time.x = this.reqWidth - Panel.MARGIN - this.time.textWidth;
		} else {
			this.toValue.text = '???';
			this.toValue.tint = 0xcccccc;

			this.time.text = '';
		}

		switch (this.fleetType) {
		case Fleet.TRANSPORT:
			this.ok.label = "Migrate";
			break;
		case Fleet.NAVAL:
			this.ok.label = "Invade";
			break;
		case Fleet.SETTLER:
			this.ok.label = "Colonize";
			break;
		}

		this.updateSize();
		this.updateOK();

		scene.map.link( this.island, this.to );
	}
}

MigratePanel.prototype.select = function( island ) {

	IslandPanel.prototype.select.call( this, island );

	scene.map.link( this.island, null );
}

MigratePanel.prototype.updateSize = function() {
	if (this.fleetType) {

		var limitFrom = Math.floor( this.island.population / 2);
		var limitTo = this.fleetType == Fleet.NAVAL ? this.to.size : Math.round( this.to.size - this.to.population );
		var limit = Math.min( limitFrom, limitTo );

		this.size.visible = true;
		this.size.setRange( 1, limit, limit );

	} else {

		this.size.visible = false;

	}
}

MigratePanel.prototype.updateOK = function() {
	this.ok.visible = (this.fleetType);
}