function ConstructPanel( game ) {
	IslandPanel.call( this, game );
}

ConstructPanel.prototype = Object.create( IslandPanel.prototype );
ConstructPanel.prototype.constructor = ConstructPanel;

ConstructPanel.prototype.createChildren = function() {

	IslandPanel.prototype.createChildren.call( this );

	this.buildings = game.add.group( this );

	this.cancel = new RGButton( game, "Cancel", this.onCancel, this );
	this.addChild( this.cancel );
}

ConstructPanel.prototype.layout = function() {

	IslandPanel.prototype.layout.call( this );

	this.cancel.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.cancel.x = (this.reqWidth - this.cancel.width) / 2;
	this.cancel.y = this.reqHeight - Panel.MARGIN - this.cancel.height;

	var pos = this.info.y + this.info.textHeight + Panel.MARGIN;
	for (var b in this.buildings.children) {
		var btn = this.buildings.children[b];
		btn.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
		btn.x = Panel.MARGIN;
		btn.y = pos;
		pos = btn.bottom + Panel.MARGIN;
	}
}

ConstructPanel.prototype.select = function( island, refresh ) {

	IslandPanel.prototype.select.call( this, island, refresh );

	this.buildings.removeAll( true );

	if (!this.island.buildings) {
		return;
	}

	for (var b in Buildings.ALL) {
		var name = Buildings.ALL[b];
		if (!this.island.has( name )) {

			var canConstruct = true;
			for (var r in Buildings[name].reqs) {
				if (!this.island.has( Buildings[name].reqs[r] )) {
					canConstruct = false;
					break;
				}
			}

			if (canConstruct) {
				var cap = name[0].toUpperCase() + name.substr( 1 );
				var btn = new RGButton( game, cap, this.onBuilding, this );
				btn.name = name;
				this.buildings.add( btn );
			}
		}
	}

	this.layout();
}

ConstructPanel.prototype.onCancel = function() {
	oceanTribes.switchPanel( IslandMainPanel );
	oceanTribes.map.onClick.dispatch( this.island );
}

ConstructPanel.prototype.onBuilding = function( btn ) {
	var building = btn.name;
	this.island.curTask = building;
	this.island.taskProgress = 0;
	oceanTribes.switchPanel( IslandMainPanel ).select( this.island );
}