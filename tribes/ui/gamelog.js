var gamelog;

function GameLog( game ) {
	View.call( this, game );

	this.pos = 0;

	gamelog = this;
}

GameLog.prototype = Object.create( View.prototype );
GameLog.prototype.constructor = GameLog;

GameLog.prototype.message = function( icon, text, callback, callbackContext ) {
	var message = new GameLog.Message( game, icon, text, callback, callbackContext );
	message.resize( 0, GameLog.Message.HEIGHT );
	message.y = this.pos;
	this.add( message );

	this.pos = message.bottom;
}

GameLog.prototype.clear = function() {
	this.removeAll();
	this.pos = 0;
}

GameLog.Message = function( game, icon, text, callback, callbackContext ) {

	this.callback = callback;
	this.callbackContext = callbackContext;

	View.call( this, game );

	this.tf.text = text;
	this.icon.frame = icon;
}

GameLog.Message.prototype = Object.create( View.prototype );
GameLog.Message.prototype.constructor = GameLog.Message;

GameLog.Message.HEIGHT = 30;

GameLog.Message.prototype.createChildren = function() {
	this.button = new Phaser.Button( game, 0, 0, '', this.callback, this.callbackContext );
	this.add( this.button );

	this.tf = game.add.bitmapText( 0, 0, 'font12', '', 12, this );

	this.icon = game.add.image( 0, 0, 'log', 0, this );
}

GameLog.Message.prototype.layout = function() {

	this.reqWidth = this.icon.width + Panel.LINE + this.tf.textWidth;
	console.log( this.icon.width, Panel.LINE, this.tf.textWidth, "=" + this.reqWidth );

	this.button.width = this.reqWidth;
	this.button.height = this.reqHeight;

	this.tf.x = this.icon.width + Panel.LINE;
	this.tf.y = (this.reqHeight - this.tf.textHeight) / 2;

	this.icon.y = (this.reqHeight - this.icon.height) / 2;
}