function Warrior( game, tribe ) {
	Phaser.Image.call( this, game, 0, 0, 'warrior' );

	this.smoothed = false;
	this.frame = tribe.attackLevel * 4 + tribe.flag;

	this.anchor.set( 0, 1 );
}

Warrior.SIZE = 64;

Warrior.prototype = Object.create( Phaser.Image.prototype );
Warrior.prototype.constructor = Warrior;

Warrior.prototype.slay = function() {

	var p = this.parent.parent.toLocal( new Phaser.Point( this.width / 2, -this.height / 2 ), this );
	var im = game.add.image( 0, 0, 'blood', this.frame, this.parent.parent );
	im.smoothed = false;
	im.anchor.set( 0.5, 0.5 );
	im.pivot.set( 0.5, 0.5 );
	im.rotation = Math.random() * 360;
	im.x = p.x;
	im.y = p.y;

	game.add.tween( im ).to( {alpha: 0}, 100, null, true );
	game.add.tween( im.scale ).to( {x: 1.5, y: 1.5}, 100, null, true );

	this.destroy();
}