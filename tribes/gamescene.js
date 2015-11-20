function GameScene( game ) {
	View.call( this, game );
}

GameScene.prototype = Object.create( View.prototype );
GameScene.prototype.constructor = GameScene;

GameScene.prototype.init = function () {
	this.switchPanel( IslandMainPanel ).select( Universe.player.home );
	this.map.updateFieldOfView( Universe.player );

	game.sound.mute = (localStorage.muted == 'true');

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

	this.soundBtn = game.add.button( 0, 0, 'sound', this.onSound, this, 0, 1, 0, 0, this );
}

GameScene.prototype.layout = function () {

	this.tribePanel.resize( 200, 100 );
	this.tribePanel.x = this.reqWidth - this.tribePanel.width;

	this.soundBtn.x = this.reqWidth - this.soundBtn.width;

	this.layoutPanel();

	this.map.resize( this.reqWidth - 200, this.reqHeight );

	PopUp.layout();
}

GameScene.prototype.layoutPanel = function () {
	if (this.panel) {
		this.panel.resize( this.tribePanel.width, this.reqHeight - this.tribePanel.height + Panel.BEVEL );
		this.panel.x = this.reqWidth - this.panel.width;
		this.panel.y = this.tribePanel.bottom - Panel.BEVEL;
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

GameScene.prototype.onSound = function () {
	localStorage.muted = (game.sound.mute = !game.sound.mute);
}