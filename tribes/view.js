function View( game ) {
	Phaser.Group.call( this, game );

	this.reqWidth = NaN;
	this.reqHeight = NaN;

	Object.defineProperty( this, 'width', {
		get : this.getWidth,
		set	: this.setWidth
	} );
	Object.defineProperty( this, 'height', {
		get : this.getHeight,
		set	: this.setHeight
	} );
	Object.defineProperty( this, 'right', {
		get : this.getRight
	} );
	Object.defineProperty( this, 'bottom', {
		get : this.getBottom
	} );

	this.createChildren();
}

View.prototype = Object.create( Phaser.Group.prototype );
View.prototype.constructor = View;

View.prototype.resize = function ( width, height ) {
	this.reqWidth = width;
	this.reqHeight = height;

	this.layout();
}

View.prototype.createChildren = function() {
}

View.prototype.layout = function() {
}

View.prototype.getWidth = function() {
	return this.reqWidth;
}

View.prototype.setWidth = function( value ) {
	this.resize( value, reqHeight );
}

View.prototype.getHeight = function() {
	return this.reqHeight;
}

View.prototype.setHeight = function( value ) {
	this.resize( reqWidth, value );
}

View.prototype.getRight = function() {
	return this.x + this.width;
}

View.prototype.getBottom = function() {
	return this.y + this.height;
}

View.prototype.copyBounds = function( view, padding ) {
	padding = padding || 0;
	this.x = view.x + padding;
	this.y = view.y + padding;
	this.resize( view.width - padding*2, view.height - padding*2 );
}