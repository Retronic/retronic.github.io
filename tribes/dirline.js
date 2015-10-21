function DirLine( game ) {
	Phaser.TileSprite.call( this, game, 0, 0, 16, 4, "dashed" );
	this.autoScroll( 16, 0 );
}

DirLine.prototype = Object.create( Phaser.TileSprite.prototype );
DirLine.prototype.constructor = DirLine;

DirLine.prototype.draw = function( from, to, offset ) {

	offset = offset || 0;

	var dx = to.x - from.x;
	var dy = to.y - from.y;
	this.rotation = Math.atan2( dy, dx );
	var d = Math.sqrt( dx * dx + dy * dy );

	this.x = from.x + offset * dx / d;
	this.y = from.y + offset * dy / d;
	
	this.width = d - offset * 2;

	this.visible = true;
}