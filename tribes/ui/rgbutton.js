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

	this._tooltipText = "";
	Object.defineProperty( this, 'tooltip', {
		set	: this.setTooltip
	} );
}

RGButton.prototype = Object.create( View.prototype );
RGButton.prototype.constructor = RGButton;

RGButton.HEIGHT = 30;

RGButton.prototype.createChildren = function() {

	this.bg = game.add.graphics( 0, 0, this );

	this.button = new Phaser.Button( game, 0, 0, '', this.onButtonClick, this );
	this.addChild( this.button );

	this._label = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this._label.smoothed = false;
}

RGButton.prototype.layout = function() {

	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 
		Panel.LINE, Panel.LINE, 
		this.reqWidth - Panel.LINE*2, 
		this.reqHeight - Panel.LINE*2 );

	this.button.width = this.reqWidth;
	this.button.height = this.reqHeight;

	this._label.x = Math.floor( (this.reqWidth - this._label.textWidth) / 2 );
	this._label.y = Math.floor( (this.reqHeight - this._label.textHeight) / 2 );
}

RGButton.prototype.onButtonClick = function() {
	game.add.audio( 'click' ).play();
	this.onClick.dispatch( this );

	Tooltip.hide();
}

RGButton.prototype.setLabel = function( value ) {
	this._label.text = value;
	this.layout();
}

RGButton.prototype.setTooltip = function( value ) {
	this._tooltipText = value;
	if (value) {
		this.button.events.onInputOver.add( this.showTooltip, this );
		this.button.events.onInputOut.add( Tooltip.hide );
	} else {
		this.button.events.onInputOver.remove( this.showTooltip, this );
		this.button.events.onInputOut.remove( Tooltip.hide );
	}
}

RGButton.prototype.showTooltip = function( value ) {
	Tooltip.show( this._tooltipText, this.name ? this.name[0].toUpperCase() + this.name.substr( 1 ) : "" );
}