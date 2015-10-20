function DirLine( game ) {
	Phaser.TileSprite.call( this, game, 0, 0, 16, 2, "dashed" );
	this.autoScroll( 16, 0 );
}

DirLine.prototype = Object.create( Phaser.TileSprite.prototype );
DirLine.prototype.constructor = DirLine;

DirLine.prototype.draw = function( from, to ) {
	this.x = from.x;
	this.y = from.y;
	var dx = to.x - from.x;
	var dy = to.y - from.y;
	this.rotation = Math.atan2( dy, dx );
	this.width = Math.sqrt( dx * dx + dy * dy );

	this.visible = true;
}