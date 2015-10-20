function IslandPanel( game ) {
	View.call( this, game );

	this.island = null;
}

IslandPanel.prototype = Object.create( View.prototype );
IslandPanel.prototype.constructor = IslandPanel;

IslandPanel.prototype.destroy = function() {
	if (this.island) {
		this.island.onChanged.remove( this.onIslandChanged, this );
	}

	View.prototype.destroy.call( this );
}

IslandPanel.prototype.createChildren = function() {

	this.bg = game.add.graphics( 0, 0, this );

	this.name = game.add.bitmapText( 10, 10, "font12", "", 12, this );
	this.name.smoothed = false;
	this.name.align = 'center';

	this.info = game.add.bitmapText( 10, 10, "font12", "", 12, this );
	this.info.smoothed = false;

	this.endTurn = new RGButton( game, "End Turn" );
	this.endTurn.onClick.add( Universe.endTurn, Universe );
	this.addChild( this.endTurn );

	this.construct = new RGButton( game, "Construct" );
	this.construct.visible = false;
	this.addChild( this.construct );

	this.migrate = new RGButton( game, "Migrate", this.onMigrate, this );
	this.addChild( this.migrate );
}

IslandPanel.prototype.layout = function() {

	this.name.x = Math.floor( (this.width - this.name.width) / 2 );

	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 2, 2, this.reqWidth-4, this.reqHeight-4 );
	var m = this.reqWidth-20;
	var p = this.name.y + this.name.textHeight + 10;
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 10, p, m, m );
	this.bg.beginFill( 0x003344 );
	this.bg.drawRect( 12, p+2, m-4, m-4 );

	if (this.image) {
		this.image.x = this.reqWidth / 2;
		this.image.y = p + m/2;
		this.image.scale.setTo( 5, 5 );
	}

	this.info.y = p + m + 10;

	this.endTurn.resize( this.reqWidth - 20, 30 );
	this.endTurn.x = (this.reqWidth - this.endTurn.width) / 2;
	this.endTurn.y = this.reqHeight - 10 - this.endTurn.height;

	this.construct.resize( this.reqWidth - 20, 30 );
	this.construct.x = (this.reqWidth - this.construct.width) / 2;
	this.construct.y = this.info.y + this.info.textHeight + 10;

	this.migrate.resize( this.reqWidth - 20, 30 );
	this.migrate.x = (this.reqWidth - this.migrate.width) / 2;
	this.migrate.y = this.construct.bottom + 10;
}

IslandPanel.prototype.mapClicked = function( object ) {
	if (object instanceof Island) {
		this.select( object );
	} else if (object instanceof Fleet) {
		oceanTribes.switchPanel( FleetPanel ).select( object );
	}
}

IslandPanel.prototype.select = function( island, refresh ) {

	if (island == this.island && !refresh) {
		return;
	}

	if (this.island) {
		this.island.onChanged.remove( this.onIslandChanged, this );
		this.remove( this.image );
	}

	this.island = island;
	this.island.onChanged.add( this.onIslandChanged, this );

	if (island.tribe) {
		this.name.text = island.name + '\n- ' + island.tribe.name + ' -';
		this.name.tint = island.tribe.color;
	} else {
		this.name.text = island.name + '\n- uninhabited -';
		this.name.tint = 0xFFFFFF;
	}

	var s;
	if (island.population) {
		s = 'population: ' + Math.round(island.population) + '/' + island.size;
	} else {
		s = 'size: ' + island.size;
	}
	var type = [];
	if (island.fertility == Island.FERTILE) {
		type.push( "fertile" );
	} else if (island.fertility == Island.BARREN) {
		type.push( "barren" );
	}
	if (island.minerals == Island.RICH) {
		type.push( "mineral rich" );
	} else if (island.minerals == Island.POOR) {
		type.push( "mineral poor" );
	}
	this.info.text = s + '\n' + (type.length ? type.join( ', ' ) : 'normal');

	this.construct.visible = (island.tribe == Universe.player)

	if (island.tribe == Universe.player) {
		this.migrate.label = "Migrate";
	} else if (island.tribe == null) {
		this.migrate.label = "Colonize";
	} else {
		this.migrate.label = "Invade";
	}

	if (this.island) {
		this.image = game.add.image( 0, 0, this.island.view.button.texture, null, this );
		this.image.anchor.setTo( 0.5, 0.5 );
		this.image.pivot.setTo( 0.5, 0.5 );
		this.image.angle = this.island.view.button.angle;
	} else {
		this.image = null;
	}

	this.layout();

	oceanTribes.map.select( island );
}

IslandPanel.prototype.onIslandChanged = function() {
	this.select( this.island, true );
}

IslandPanel.prototype.onMigrate = function() {
	var panel =oceanTribes.switchPanel( MigratePanel );
	if (this.island.tribe == Universe.player) {
		panel.migrateFrom( this.island );
	} else {
		panel.migrateTo( this.island );
	}
}