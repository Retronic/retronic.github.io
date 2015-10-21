function AITurnPanel( game ) {
	Panel.call( this, game );
}

AITurnPanel.prototype = Object.create( Panel.prototype );
AITurnPanel.prototype.constructor = AITurnPanel;

AITurnPanel.prototype.createChildren = function() {
	Panel.prototype.createChildren.call( this );

	this.message = game.add.bitmapText( 0, 0, "font12", "Other player's turn", 12, this );
	this.player = game.add.bitmapText( 0, 0, "font12", "", 12, this );
}

AITurnPanel.prototype.layout = function() {

	Panel.prototype.layout.call( this );

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
