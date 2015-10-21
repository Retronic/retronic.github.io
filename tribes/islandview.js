function IslandView( game, island ) {

	Phaser.Group.call( this, game );

	// Island model
	this.data = island;
	island.view = this;

	island.onChanged.add( this.refresh, this );

	this.onClick = new Phaser.Signal();

	this._zoom = 1;
	Object.defineProperty( this, 'zoom', {
		set	: this.setZoom
	} );

	// Island image
	var bmp = game.add.bitmapData( Island.MAP_SIZE, Island.MAP_SIZE, Universe.id() );
	for (var i=1; i < Island.MAP_SIZE-2; i++) {
		for (var j=1; j < Island.MAP_SIZE-2; j++) {
			if (island.map[i][j]) {
				bmp.setPixel( j, i, 0xff, 0xff, 0xff, false );
			}
		}
	}
	bmp.context.putImageData( bmp.imageData, 0, 0 );

	var angle = Math.random() * 360;

	var bmp1 = game.add.bitmapData( Island.MAP_SIZE, Island.MAP_SIZE, Universe.id() );
	bmp1.copy( bmp );
	this.shore = game.add.image( 0, 0, bmp1, null, this );
	this.shore.anchor.set( 0.5, 0.5 );
	this.shore.pivot.set( 0.5, 0.5 );
	this.shore.angle = angle;
	this.shore.tint = 0x094f66;

	this.button = new Phaser.Button( game, 0, 0, bmp, this.onButtonClick, this );
	this.button.smoothed = false;
	this.button.anchor.set( 0.5, 0.5 );
	this.button.pivot.set( 0.5, 0.5 );
	this.button.angle = angle;
	this.button.tint = 0x448844;
	this.addChild( this.button );

	this.updateSize();

	// Island owner's flag
	this.flag = game.add.image( 0, 0, 'flag', null, this );
	this.flag.smoothed = false;
	this.flag.anchor.set( 0.5, 0.5 );
	if (island.tribe && island.tribe.home == island) {
		this.flag.visible = true;
		this.flag.frame = island.tribe.flag;
	} else {
		this.flag.visible = false;
	}

	this.name = game.add.bitmapText( 10, 10, "font8", island.name, 8, this );
	this.name.smoothed = false;
	this.name.tint = island.tribe ? island.tribe.color : 0xFFFFFF;
	this.name.x = -this.name.textWidth / 2;

	this.visible = false;
}

IslandView.prototype = Object.create( Phaser.Group.prototype );
IslandView.prototype.constructor = IslandView;

IslandView.prototype.onButtonClick = function() {
	this.onClick.dispatch( this );
}

IslandView.prototype.setZoom = function( value ) {
	this._zoom = value;
	this.updateSize();
}

IslandView.prototype.updateSize = function() {
	var size = 2 * this._zoom;
	this.button.scale.set( size, size );
	this.shore.scale.set( size * 1.2, size * 1.2 );
}

IslandView.prototype.refresh = function() {
	this.name.tint = this.data.tribe ? this.data.tribe.color : 0xFFFFFF;
}