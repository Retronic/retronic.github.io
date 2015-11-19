function GameOverPopUp( game, victory ) {
	this.victory = victory;
	PopUp.call( this, game );
}

GameOverPopUp.prototype = Object.create( PopUp.prototype );
GameOverPopUp.prototype.constructor = GameOverPopUp;

GameOverPopUp.prototype.createChildren = function() {
	PopUp.prototype.createChildren.call( this );

	this.banner = game.add.image( Panel.MARGIN*2, Panel.MARGIN*2, this.victory ? 'victory' : 'defeat', null, this );
	var width = this.banner.width + Panel.MARGIN*4;

	this.message = new TextView( game, this.victory ? 
		"You have destroyed all your enemies!" : 
		"Your enemies have captured all your islands!", 'font12', 12, 'center' );
	this.message.resize( width, 0 );
	this.message.y = this.banner.y + this.banner.height + Panel.MARGIN;
	this.add( this.message );

	this.refresh = new TextView( game, "Refresh this page to start new game", 'font12', 12, 'center' );
	this.refresh.resize( width, 0 );
	this.refresh.y = this.message.bottom + Panel.MARGIN;
	this.refresh.color = 0xFFFF88;
	this.add( this.refresh );

	this.resize( width, this.refresh.bottom + Panel.MARGIN*2 );
}

GameOverPopUp.prototype.onClose = function() {
}
