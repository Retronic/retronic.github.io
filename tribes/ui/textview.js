function TextView( game, text, font, size, align ) {

	this._text = text || "";
	this._font = font || "font12";
	this._size = size || 12;
	this._align = align || "left"

	View.call( this, game );

	Object.defineProperty( this, 'text', {
		set	: this.setText
	} );
	Object.defineProperty( this, 'color', {
		set	: this.setColor
	} );
}

TextView.prototype = Object.create( View.prototype );
TextView.prototype.constructor = TextView;

TextView.prototype.createChildren = function() {
	this.tf = game.add.bitmapText( 0, 0, this._font, this._text, this._size, this );
	this.tf.align = this._align;
}

TextView.prototype.layout = function() {
	if (this._align == "center") {
		this.tf.x = Math.floor( (this.reqWidth - this.tf.textWidth) / 2 );
	}
}

TextView.prototype.getWidth = function( value ) {
	return this._align == "center" ? this.reqWidth : this.tf.textWidth;
}

TextView.prototype.getHeight = function( value ) {
	return this.tf.textHeight;
}

TextView.prototype.setText = function( value ) {
	this.tf.text = value;
	this.layout();
}

TextView.prototype.setColor = function( value ) {
	this.tf.tint = value;
}