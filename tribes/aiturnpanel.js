function AITurnPanel( game ) {
	View.call( this, game );
}

AITurnPanel.prototype = Object.create( View.prototype );
AITurnPanel.prototype.constructor = AITurnPanel;

AITurnPanel.prototype.createChildren = function() {
	this.bg = game.add.graphics( 0, 0, this );

	this.message = game.add.bitmapText( 0, 0, "font12", "Other player's turn", 12, this );
	this.player = game.add.bitmapText( 0, 0, "font12", "", 12, this );
}

AITurnPanel.prototype.layout = function() {

	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 2, 2, this.reqWidth-4, this.reqHeight-4 );

	this.message.x = (this.reqWidth - this.message.textWidth) / 2;
	this.message.y = (this.reqHeight - this.message.textHeight - this.player.textHeight) / 2;

	this.player.x = (this.reqWidth - this.player.textWidth) / 2;
	this.player.y = this.message.y + this.message.textHeight;
}

AITurnPanel.prototype.setPlayer = function( player ) {
	this.player.text = player.name;
	this.player.tint = player.color;
	this.layout();
}

AITurnPanel.prototype.mapClicked = function( object ) {
}
