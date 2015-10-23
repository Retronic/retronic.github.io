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

	this.tribePanel = new TribePanel( game );
	this.add( this.tribePanel );

	this.gamelog = new GameLog( game );
	this.gamelog.x = Panel.MARGIN;
	this.gamelog.y = Panel.MARGIN;
	this.add( this.gamelog );
}

OceanTribes.prototype.layout = function () {

	this.tribePanel.resize( 200, 100 );
	this.tribePanel.x = this.reqWidth - this.tribePanel.width;

	this.layoutPanel();

	this.map.resize( this.reqWidth - 200, this.reqHeight );
}

OceanTribes.prototype.layoutPanel = function () {
	if (this.panel) {
		this.panel.resize( this.tribePanel.width, this.reqHeight - this.tribePanel.height + Panel.LINE );
		this.panel.x = this.reqWidth - this.panel.width;
		this.panel.y = this.tribePanel.bottom - Panel.LINE;
	}
}

OceanTribes.prototype.switchPanel = function( Panel, params ) {
	if (this.panel) {
		this.panel.destroy();
	}

	this.panel = new Panel( game );
	this.add( this.panel );

	this.layoutPanel();

	return this.panel;
}