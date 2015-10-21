function ProgressBar( game, label, handler, ths ) {

	RGButton.call( this, game, label, handler, ths );

	this._value = NaN;
	Object.defineProperty( this, 'value', {
		set	: this.setValue
	} );

	this._maxValue = 100;
	Object.defineProperty( this, 'maxValue', {
		set	: this.setMaxValue
	} );
}

ProgressBar.prototype = Object.create( RGButton.prototype );
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.createChildren = function() {

	RGButton.prototype.createChildren.call( this );

	this.fill = game.add.graphics( Panel.LINE, Panel.LINE, this );
	this.fill.beginFill( 0x4488cc );
	this.fill.drawRect( 0, 0, 100, 100 );
	this.swap( this.fill, this._label );

	this.percent = game.add.bitmapText( 0, 0, "font12", "", 12, this );
}

ProgressBar.prototype.layout = function() {
	RGButton.prototype.layout.call( this );

	// If the value is set to NaN, this progress bar looks like a regular RGButton
	if (isNaN( this._value )) {

		this.fill.width = 0;
		this.percent.text = "";

	} else {

		this._label.x = Panel.LINE * 2;
		this.percent.x = this.reqWidth - Panel.LINE*2 - this.percent.textWidth;
		this.percent.y = (this.reqHeight - this.percent.textHeight) / 2;

		this.fill.width = (this.reqWidth - Panel.LINE*2) * (this._value / this._maxValue);
		this.fill.height = this.reqHeight - Panel.LINE*2;
	}
}

ProgressBar.prototype.setValue = function( value ) {
	this._value = (isNaN( value ) || value <= this._maxValue ? value : this._maxValue);
	this.updateValue();
}

ProgressBar.prototype.setMaxValue = function( maxValue ) {
	this._maxValue = maxValue;
	if (this._value > maxValue) {
		this._value = maxValue;
	}
	this.updateValue();
}

ProgressBar.prototype.updateValue = function() {
	this.percent.text = Math.round( this._value / this._maxValue * 100 ) + "%";
	this.layout();
}