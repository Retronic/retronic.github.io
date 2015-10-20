function RGButton( game, label, handler, ths ) {

	View.call( this, game );
	this._label.text = label;

	this.onClick = new Phaser.Signal();

	if (handler) {
		this.onClick.add( handler, ths );
	}

	Object.defineProperty( this, 'label', {
		set	: this.setLabel
	} );
}

RGButton.prototype = Object.create( View.prototype );
RGButton.prototype.constructor = RGButton;

RGButton.prototype.createChildren = function() {

	this.bg = game.add.graphics( 0, 0, this );

	this.button = new Phaser.Button( game, 0, 0, '', this.onButtonClick, this );
	this.addChild( this.button );

	this._label = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this._label.smoothed = false;
}

RGButton.prototype.layout = function() {

	this.bg.clear();
	this.bg.lineStyle( 2, 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );

	this.button.width = this.reqWidth;
	this.button.height = this.reqHeight;

	this._label.x = Math.floor( (this.reqWidth - this._label.textWidth) / 2 );
	this._label.y = Math.floor( (this.reqHeight - this._label.textHeight) / 2 );
}

RGButton.prototype.onButtonClick = function() {
	this.onClick.dispatch( this );
}

RGButton.prototype.setLabel = function( value ) {
	this._label.text = value;
	this.layout();
}