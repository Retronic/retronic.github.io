function RangeValue( game ) {
	View.call( this, game );

	this.onChanged = new Phaser.Signal();
}

RangeValue.prototype = Object.create( View.prototype );
RangeValue.prototype.constructor = RangeValue;

RangeValue.prototype.createChildren =  function() {
	this.btnMin = new RGButton( game, "<<", this.onMin, this );
	this.add( this.btnMin );

	this.btnMax = new RGButton( game, ">>", this.onMax, this );
	this.add( this.btnMax );

	this.btnDecrease = new RGButton( game, "-", this.onDecrease, this );
	this.add( this.btnDecrease );

	this.btnIncrease = new RGButton( game, "+", this.onIncrease, this );
	this.add( this.btnIncrease );

	this.graphics = game.add.graphics( 0, 0, this );

	this.txtValue = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this.txtValue.tint = 0xFFFF88;
}

RangeValue.prototype.layout =  function() {

	var h = this.reqHeight;

	this.btnMin.resize( h, h );

	this.btnDecrease.resize( h, h );
	this.btnDecrease.x = this.btnMin.right - Panel.LINE;

	this.btnMax.resize( h, h );
	this.btnMax.x = this.reqWidth - h;

	this.btnIncrease.resize( h, h );
	this.btnIncrease.x = this.btnMax.x + Panel.LINE - h;

	this.graphics.clear();
	this.graphics.beginFill( 0x003344 );
	this.graphics.drawRect( this.btnDecrease.right, 0, this.btnIncrease.x - this.btnDecrease.right, this.reqHeight );

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
	this.onChanged.dispatch();
}

RangeValue.prototype.onMax = function() {
	this.setRange( this.min, this.max, this.max );	
	this.onChanged.dispatch();
}

RangeValue.prototype.onDecrease = function() {
	this.setRange( this.min, this.max, this.value-1 );
	this.onChanged.dispatch();
}

RangeValue.prototype.onIncrease = function() {
	this.setRange( this.min, this.max, this.value+1 );
	this.onChanged.dispatch();
}