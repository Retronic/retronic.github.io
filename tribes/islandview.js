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
	this.shore = game.add.image( 0, 0, island.shore, null, this );
	this.shore.anchor.set( 0.5, 0.5 );
	this.shore.pivot.set( 0.5, 0.5 );
	this.shore.tint = 0x094f66;

	this.button = new Phaser.Button( game, 0, 0, island.land, this.onButtonClick, this );
	this.button.smoothed = false;
	this.button.anchor.set( 0.5, 0.5 );
	this.button.pivot.set( 0.5, 0.5 );
	this.button.tint = 0x558844;
	this.addChild( this.button );

	switch (island.resource) {
	case Island.Resources.GAME:
		this.button.tint = 0x225533;
		break;
	case Island.Resources.STONE:
		this.button.tint = 0x888877;
		break;
	case Island.Resources.CLIFFS:
		this.shore.tint = 0xBBBBAA;
		break;
	}

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

	this.flotilla = game.add.image( 16, 16, 'ship', null, this );
	this.flotilla.anchor.set( 0.5, 0.5 );
	this.flotilla.smoothed = false;

	if (island.tribe && island.ship) {
		this.flotilla.visible = true;
		this.flotilla.frame = island.tribe.flag;
	} else {
		this.flotilla.visible = false;
	}

	this.name = game.add.bitmapText( 0, 10, "font8", island.name, 8, this );
	this.name.smoothed = false;
	this.name.tint = island.tribe ? island.tribe.color : 0xFFFFFF;
	this.name.x = Math.floor( -this.name.textWidth / 2 );

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
	var size = 2 * this._zoom * Island.MAP_SIZE / Island.BMP_SIZE;
	this.button.scale.set( size, size );
	this.shore.scale.set( size, size );
}

IslandView.prototype.refresh = function() {

	var island = this.data;

	this.name.tint = island.tribe ? island.tribe.color : 0xFFFFFF;

	if (island.tribe && island.tribe.home == island) {
		this.flag.visible = true;
		this.flag.frame = island.tribe.flag;
	} else {
		this.flag.visible = false;
	}

	if (island.tribe && island.ship) {
		this.flotilla.visible = true;
		this.flotilla.frame = island.tribe.flag;
	} else {
		this.flotilla.visible = false;
	}
}