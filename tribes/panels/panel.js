function Panel( game ) {
	View.call( this, game );
}

Panel.prototype = Object.create( View.prototype );
Panel.prototype.constructor = Panel;

Panel.MARGIN	= 10;
Panel.LINE		= 2;

Panel.prototype.createChildren = function() {
	this.bg = game.add.graphics( 0, 0, this );
}

Panel.prototype.layout = function() {
	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 
		Panel.LINE, Panel.LINE, 
		this.reqWidth - Panel.LINE*2, 
		this.reqHeight - Panel.LINE*2 );
}

Panel.prototype.mapClicked = function( object ) {
}