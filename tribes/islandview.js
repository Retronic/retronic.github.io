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
				if (!island.map[i-1][j] || !island.map[i+1][j] || !island.map[i][j-1] || !island.map[i][j+1]) {
					//073a4b
					bmp.setPixel( j, i, 0x09, 0x4f, 0x66, false );
				} else {
					bmp.setPixel( j, i, 0x44, 0x88, 0x44, false );
				}
			}
		}
	}
	bmp.context.putImageData( bmp.imageData, 0, 0 );

	this.button = new Phaser.Button( game, 0, 0, bmp, this.onButtonClick, this );
	this.button.anchor.set( 0.5, 0.5 );
	this.button.pivot.set( 0.5, 0.5 );
	this.button.angle = Math.random() * 360;
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
}

IslandView.prototype.refresh = function() {
	this.name.tint = this.data.tribe ? this.data.tribe.color : 0xFFFFFF;
}