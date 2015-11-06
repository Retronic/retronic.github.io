function FleetView( game, fleet ) {
	Phaser.Group.call( this, game );

	this.data = fleet;
	fleet.view = this;

	fleet.onChanged.add( this.refresh, this );

	this.button = new Phaser.Button( game, 0, 0, 'fleet', this.onButtonClick, this );
	this.button.anchor.set( 0.5, 0.5 );
	this.button.smoothed = false;
	this.button.frame = fleet.tribe.flag;
	this.addChild( this.button );

	this.onClick = new Phaser.Signal();

	this.visible = (fleet.tribe == Universe.player);

	this.refresh();
}

FleetView.prototype = Object.create( Phaser.Group.prototype );
FleetView.prototype.constructor = IslandView;

FleetView.prototype.onButtonClick = function() {
	this.onClick.dispatch( this );
}

FleetView.prototype.refresh = function() {

	var fleet = this.data;
	if (!fleet.isAlive) {
		this.destroy();
		return;
	}

	var from =fleet.from.view;
	var to = fleet.to.view;

	var ox = 16;
	var oy = 16;

	var p = fleet.progress / fleet.duration;
	var px = ox + from.x + (to.x - from.x) * p;
	var py = oy + from.y + (to.y - from.y) * p;
	if (this.tween) {
		this.tween.stop();
		this.tween = game.add.tween( this ).to( {x: px, y: py}, 300, null, true );
		if (fleet.tribe == Universe.player && scene.map.selected == fleet) {
			this.tween.onUpdateCallback( function() {
				scene.map.select( fleet );
			}, this );
		}
	} else {
		this.x = px;
		this.y = py;
		this.tween = game.add.tween( this );
	}

	if (fleet.tribe != Universe.player) {
		this.visible = false;

		var r2 = Universe.player.getViewDistance();
		r2 *= r2;

		for (var i in Universe.player.islands) {
			if (Universe.distance2( fleet, Universe.player.islands[i] ) < r2) {
				this.visible = true;
				break;
			}
		}
	}
}

