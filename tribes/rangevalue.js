function RangeValue( game ) {
	View.call( this, game );
}

RangeValue.prototype = Object.create( View.prototype );
RangeValue.prototype.constructor = RangeValue;

RangeValue.prototype.createChildren =  function() {
	this.btnMin = new RGButton( game, "min", this.onMin, this );
	this.add( this.btnMin );

	this.btnMax = new RGButton( game, "max", this.onMax, this );
	this.add( this.btnMax );

	this.btnDecrease = new RGButton( game, "-", this.onDecrease, this );
	this.add( this.btnDecrease );

	this.btnIncrease = new RGButton( game, "+", this.onIncrease, this );
	this.add( this.btnIncrease );

	this.txtValue = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this.txtValue.tint = 0xFFFF88;
}

RangeValue.prototype.layout =  function() {

	var h = this.reqHeight;

	this.btnMin.resize( h, h );

	this.btnDecrease.resize( h, h );
	this.btnDecrease.x = this.btnMin.right + 4;

	this.btnMax.resize( h, h );
	this.btnMax.x = this.reqWidth - h;

	this.btnIncrease.resize( h, h );
	this.btnIncrease.x = this.btnMax.x - 4 - h;

	this.txtValue.x = (this.reqWidth - this.txtValue.textWidth) / 2;
	this.txtValue.y = (this.reqHeight - this.txtValue.textHeight) / 2;
}

RangeValue.prototype.setRange = function( min, max, value ) {
	this.min = min;
	this.max = max;
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	this.value = value;

	this.txtValue.text = value;
	this.txtValue.x = (this.reqWidth - this.txtValue.textWidth) / 2;
}

RangeValue.prototype.onMin = function() {
	this.setRange( this.min, this.max, this.min );
}

RangeValue.prototype.onMax = function() {
	this.setRange( this.min, this.max, this.max );	
}

RangeValue.prototype.onDecrease = function() {
	this.setRange( this.min, this.max, this.value-1 );
}

RangeValue.prototype.onIncrease = function() {
	this.setRange( this.min, this.max, this.value+1 );
}