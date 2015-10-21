function FromTo( game, from, to ) {
	View.call( this, game );

	Object.defineProperty( this, 'from', {
		get : this.getFrom,
		set	: this.setFrom
	} );
	Object.defineProperty( this, 'to', {
		get : this.getTo,
		set	: this.setTo
	} );

	this.from = from;
	this.to = to;
}

FromTo.prototype = Object.create( View.prototype );
FromTo.prototype.constructor = FromTo;

FromTo.MARGIN = 10;

FromTo.prototype.createChildren = function() {
	this.fromLabel = game.add.bitmapText( 0, 0, "font12", "From", 12, this );
	this.fromValue = game.add.bitmapText( 0, 0, "font12", "", 12, this );
	this.toLabel = game.add.bitmapText( 0, 0, "font12", "To", 12, this );
	this.toValue = game.add.bitmapText( 0, 0, "font12", "", 12, this );
}

FromTo.prototype.layout = function() {

	var margin = 10;

	this.fromLabel.x = FromTo.MARGIN;
	this.fromLabel.y = FromTo.MARGIN;
	this.fromValue.x = FromTo.MARGIN;
	this.fromValue.y = this.fromLabel.y + this.fromLabel.textHeight;

	this.toLabel.x = FromTo.MARGIN;
	this.toLabel.y = this.fromValue.y + this.fromValue.textHeight + FromTo.MARGIN;
	this.toValue.x = FromTo.MARGIN;
	this.toValue.y = this.toLabel.y + this.toLabel.textHeight;
}

FromTo.prototype.getHeight = function() {
	return this.toValue.y + this.toValue.textHeight + FromTo.MARGIN;
}

FromTo.prototype.getFrom = function() {
	return this._from;
}

FromTo.prototype.setFrom = function( value ) {
	this.fromValue.text = value ? value.name : "";
	this.fromValue.tint = value && value.tribe ? value.tribe.color : 0xFFFFFF;
	this._from = value;
}

FromTo.prototype.getTo = function() {
	return this._to;
}

FromTo.prototype.setTo = function( value ) {
	this.toValue.text = value ? value.name : "";
	this.toValue.tint = value && value.tribe ? value.tribe.color : 0xFFFFFF;
	this._to = value;
}