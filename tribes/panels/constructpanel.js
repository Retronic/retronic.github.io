function ConstructPanel( game ) {
	IslandPanel.call( this, game );

	this.esc = game.input.keyboard.addKey( Phaser.Keyboard.ESC );
	this.esc.onDown.add( this.onCancel, this );
}

ConstructPanel.prototype = Object.create( IslandPanel.prototype );
ConstructPanel.prototype.constructor = ConstructPanel;

ConstructPanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

	this.header = new TextView( game, "Choose task", "font12", 12, "center" );
	this.header.color = 0xffff88;
	this.add( this.header );

	// For all buttons we create a group so we could easily remove them
	this.Task = game.add.group( this );

	this.cancel = new RGButton( game, "Cancel", this.onCancel, this );
	this.addChild( this.cancel );
}

ConstructPanel.prototype.layout = function() {

	IslandPanel.prototype.layout.call( this );

	this.cancel.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.cancel.x =	Panel.MARGIN;
	this.cancel.y = this.reqHeight - Panel.MARGIN - this.cancel.height;

	this.header.resize( this.reqWidth, 0 );
	this.header.y = this.sectionTop + Panel.MARGIN;

	var pos = this.header.bottom + Panel.MARGIN;
	for (var b in this.Task.children) {
		var btn = this.Task.children[b];
		btn.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
		btn.x = Panel.MARGIN;
		btn.y = pos;
		pos = btn.bottom + Panel.MARGIN;
	}
}

ConstructPanel.prototype.select = function( island, refresh ) {

	IslandPanel.prototype.select.call( this, island, refresh );

	if (island.tribe != Universe.player) {
		this.onCancel();
		return;
	}

	this.Task.removeAll( true );

	for (var b in Task.Buildings) {
		var name = Task.Buildings[b];

		if (this.island.canConstruct( name )) {
			var cap = name[0].toUpperCase() + name.substr( 1 );
			var btn = new ProgressBar( game, cap, this.onBuilding, this );
			if (island.curTask && island.curTask.name == name) {
				btn.maxValue = Task[name].cost;
				btn.value = island.curTask.progress;
			}
			btn.name = name;
			btn.tooltip = Task[name].info;
			this.Task.add( btn );
		}
	}

	if (island.curTask && island.has( Task.SHIPYARD ) && !island.ship) {
		var flotilla = island.has( Task.WORKSHOP ) ? Task.SIEGE : Task.FLOTILLA;
		var btn = new ProgressBar( game, flotilla[0].toUpperCase() + flotilla.substr( 1 ), this.onBuilding, this );
		if (island.curTask && island.curTask.name == flotilla) {
			btn.maxValue = Task[Task.FLOTILLA].cost;
			btn.value = island.curTask.progress;
		}
		btn.name = flotilla;
		this.Task.add( btn );
	}

	this.layout();
}

ConstructPanel.prototype.onCancel = function() {
	scene.switchPanel( IslandMainPanel );
	scene.map.onClick.dispatch( this.island );
}

ConstructPanel.prototype.onBuilding = function( btn ) {
	var building = btn.name;
	if (!this.island.curTask || building != this.island.curTask.name) {
		this.island.curTask = {
			name: building,
			progress: 0
		}
	}
	scene.switchPanel( IslandMainPanel ).select( this.island );
}

ConstructPanel.prototype.destroy = function() {
	this.esc.onDown.remove( this.onCancel, this );
	IslandPanel.prototype.destroy.call( this );
}