function IslandMainPanel( game ) {
	IslandPanel.call( this, game );
}

IslandMainPanel.prototype = Object.create( IslandPanel.prototype );
IslandMainPanel.prototype.constructor = IslandMainPanel;

IslandMainPanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

	this.taskLabel = new TextView( game, "Current task", "font12", 12, "center" );
	this.taskLabel.color = 0xffff88;
	this.add( this.taskLabel );

	this.endTurn = new RGButton( game, "End Turn", Universe.endTurn, Universe );
	this.addChild( this.endTurn );

	this.construct = new ProgressBar( game, "Task", this.onTask, this );
	this.addChild( this.construct );

	this.migrate = new RGButton( game, "Migrate", this.onMigrate, this );
	this.addChild( this.migrate );
}

IslandMainPanel.prototype.layout = function() {

	IslandPanel.prototype.layout.call( this );

	this.taskLabel.resize( this.reqWidth, 30 );
	this.taskLabel.y = this.sectionTop + Panel.MARGIN;

	this.endTurn.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.endTurn.x = (this.reqWidth - this.endTurn.width) / 2;
	this.endTurn.y = this.reqHeight - Panel.MARGIN - this.endTurn.height;

	this.construct.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.construct.x = (this.reqWidth - this.construct.width) / 2;
	this.construct.y = this.taskLabel.bottom + Panel.MARGIN;

	this.migrate.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.migrate.x = (this.reqWidth - this.migrate.width) / 2;
	this.migrate.y = this.endTurn.y - this.construct.height - Panel.MARGIN;
}

IslandMainPanel.prototype.select = function( island, refresh ) {

	IslandPanel.prototype.select.call( this, island, refresh );

	if (island.tribe == Universe.player) {
		this.construct.visible = 
		this.taskLabel.visible = true;
		this.migrate.visible = island.canLaunch();

		if (island.curTask) {
			var name = island.curTask.name;
			name = name[0].toUpperCase() + name.substr( 1 );
			this.construct.label = name;
			this.construct.maxValue = Buildings[island.curTask.name].cost;
			this.construct.value = island.curTask.progress;
		} else {
			this.construct.label = "None";
			this.construct.value = NaN;
		}
	} else {
		this.construct.visible = 
		this.taskLabel.visible = 
		this.migrate.visible = false;
	}
}

IslandMainPanel.prototype.onMigrate = function() {
	oceanTribes.switchPanel( MigratePanel ).select( this.island );
}

IslandMainPanel.prototype.onTask = function() {
	oceanTribes.switchPanel( ConstructPanel ).select( this.island );
}