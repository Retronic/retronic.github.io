function GameScene( game ) {
	View.call( this, game );
}

GameScene.prototype = Object.create( View.prototype );
GameScene.prototype.constructor = GameScene;

GameScene.prototype.init = function () {
	this.switchPanel( IslandMainPanel ).select( Universe.player.home );
	this.map.updateFieldOfView( Universe.player );

	var music = game.add.audio( 'music' );
	music.onDecoded.add( function() {
		music.loopFull();
	}, this );
}

GameScene.prototype.createChildren = function () {
	this.map = new MapView( game );
	this.map.onClick.add( function( object ) {
		if (this.panel) {
			this.panel.mapClicked( object );
		}
	}, this );
	this.add( this.map );

	this.tribePanel = new TribePanel( game );
	this.add( this.tribePanel );
	this.tribePanel.select( Universe.curTribe );

	this.gamelog = new GameLog( game );
	this.gamelog.x = Panel.MARGIN;
	this.gamelog.y = Panel.MARGIN;
	this.add( this.gamelog );
}

GameScene.prototype.layout = function () {

	this.tribePanel.resize( 200, 120 );
	this.tribePanel.x = this.reqWidth - this.tribePanel.width;

	this.layoutPanel();

	this.map.resize( this.reqWidth - 200, this.reqHeight );

	PopUp.layout();
}

GameScene.prototype.layoutPanel = function () {
	if (this.panel) {
		this.panel.resize( this.tribePanel.width, this.reqHeight - this.tribePanel.height + Panel.LINE );
		this.panel.x = this.reqWidth - this.panel.width;
		this.panel.y = this.tribePanel.bottom - Panel.LINE;
	}
}

GameScene.prototype.switchPanel = function( Panel, params ) {
	if (this.panel) {
		this.panel.destroy();
	}

	this.panel = new Panel( game );
	this.add( this.panel );

	this.layoutPanel();

	return this.panel;
}

GameScene.prototype.step = function () {
	switch (Universe.curTribe.state) {
	case Tribe.State.NOT_GROWN:
		Universe.curTribe.grow();
		this.tribePanel.select( Universe.curTribe );
		if (Universe.curTribe == Universe.player) {
			this.map.updateFieldOfView( Universe.player );
		}
		break;
	case Tribe.State.NOT_PROCESSED:
		Universe.curTribe.process();
		break;
	case Tribe.State.PROCESSED:
		Universe.endTurn();
		break;
	case Tribe.State.PROCESSING:
		break;
	}
}