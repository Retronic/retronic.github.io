function IslandMainPanel( game ) {
	IslandPanel.call( this, game );
}

IslandMainPanel.prototype = Object.create( IslandPanel.prototype );
IslandMainPanel.prototype.constructor = IslandMainPanel;

IslandMainPanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

	this.endTurn = new RGButton( game, "End Turn", Universe.endTurn, Universe );
	this.addChild( this.endTurn );

	this.construct = new ProgressBar( game, "Construct", this.onConstruct, this );
	this.addChild( this.construct );

	this.migrate = new RGButton( game, "Migrate", this.onMigrate, this );
	this.addChild( this.migrate );
}

IslandMainPanel.prototype.layout = function() {

	IslandPanel.prototype.layout.call( this );

	this.endTurn.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.endTurn.x = (this.reqWidth - this.endTurn.width) / 2;
	this.endTurn.y = this.reqHeight - Panel.MARGIN - this.endTurn.height;

	this.construct.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.construct.x = (this.reqWidth - this.construct.width) / 2;
	this.construct.y = this.info.y + this.info.textHeight + Panel.MARGIN;

	this.migrate.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.migrate.x = (this.reqWidth - this.migrate.width) / 2;
	this.migrate.y = this.construct.bottom + Panel.MARGIN;
}

IslandMainPanel.prototype.select = function( island, refresh ) {

	IslandPanel.prototype.select.call( this, island, refresh );

	this.migrate.visible = (island.tribe != Universe.player) || island.canLaunch();
	this.construct.visible = (island.tribe == Universe.player);
	if (this.construct.visible) {
		if (island.curTask) {
			this.construct.label = island.curTask[0].toUpperCase() + island.curTask.substr( 1 );
			this.construct.maxValue = Buildings[island.curTask].cost;
			this.construct.value = island.taskProgress;
		} else {
			this.construct.label = "Construct";
			this.construct.value = NaN;
		}
	}

	if (island.tribe == Universe.player) {
		this.migrate.label = "Migrate";
	} else if (island.tribe == null) {
		this.migrate.label = "Colonize";
	} else {
		this.migrate.label = "Invade";
	}
}

IslandMainPanel.prototype.onMigrate = function() {
	var panel =oceanTribes.switchPanel( MigratePanel );
	if (this.island.tribe == Universe.player) {
		panel.migrateFrom( this.island );
	} else {
		panel.migrateTo( this.island );
	}
}

IslandMainPanel.prototype.onConstruct = function() {
	oceanTribes.switchPanel( ConstructPanel ).select( this.island );
}