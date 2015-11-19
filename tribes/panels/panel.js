function Panel( game ) {
	View.call( this, game );
}

Panel.prototype = Object.create( View.prototype );
Panel.prototype.constructor = Panel;

Panel.MARGIN	= 10;
Panel.LINE		= 2;
Panel.BEVEL		= 4;

Panel.prototype.createChildren = function() {
	this.wood = game.add.tileSprite( 0, 0, 100, 100, 'verwood', null, this );
	this.bevel = game.add.graphics( 0, 0, this );
}

Panel.prototype.layout = function() {
	this.wood.width = this.reqWidth;
	this.wood.height = this.reqHeight;

	this.bevel.clear();
	this.drawBevel( 0, 0, this.reqWidth, this.reqHeight );
}

Panel.prototype.mapClicked = function( object ) {
}

Panel.prototype.drawBevel = function( x, y, width, height, size, reverse, light, dark ) {

	size = size || Panel.BEVEL;
	light = light || 0.3;
	dark = dark || 0.5;

	if (reverse) {
		this.bevel.beginFill( 0x110011, dark );
	} else {
		this.bevel.beginFill( 0xFFFFEE, light );
	}
	this.bevel.moveTo( x, y );
	this.bevel.lineTo( x+width, y );
	this.bevel.lineTo( x+width-size, y+size );
	this.bevel.lineTo( x+size, y+size );
	this.bevel.lineTo( x+size, y+height-size );
	this.bevel.lineTo( x, y+height );
	this.bevel.endFill();

	if (!reverse) {
		this.bevel.beginFill( 0x110011, dark );
	} else {
		this.bevel.beginFill( 0xFFFFEE, light );
	}
	this.bevel.moveTo( x+width, y );
	this.bevel.lineTo( x+width-size, y+size );
	this.bevel.lineTo( x+width-size, y+height-size );
	this.bevel.lineTo( x+size, y+height-size );
	this.bevel.lineTo( x, y+height );
	this.bevel.lineTo( x+width, y+height );
	this.bevel.endFill();
}