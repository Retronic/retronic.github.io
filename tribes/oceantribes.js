function OceanTribes( game ) {
	oceanTribes = this;
	View.call( this, game );
}

OceanTribes.prototype = Object.create( View.prototype );
OceanTribes.prototype.constructor = OceanTribes;

var oceanTribes;

OceanTribes.prototype.createChildren = function () {
	this.map = new MapView( game );
	this.map.onClick.add( function( object ) {
		if (this.panel) {
			this.panel.mapClicked( object );
		}
	}, this );
	this.add( this.map );
}

OceanTribes.prototype.layout = function () {
	if (this.panel) {
		this.panel.resize( 200, this.reqHeight );
		this.panel.x = this.reqWidth - this.panel.width;
	}
	this.map.resize( this.reqWidth - 200, this.reqHeight );
}

OceanTribes.prototype.switchPanel = function( Panel, params ) {
	if (this.panel) {
		this.panel.destroy();
	}

	this.panel = new Panel( game );
	this.add( this.panel );

	this.panel.resize( 200, this.reqHeight );
	this.panel.x = this.reqWidth - this.panel.width;

	return this.panel;
}