function GenerationScene( game ) {
	View.call( this, game );
}

GenerationScene.prototype = Object.create( View.prototype );
GenerationScene.prototype.constructor = GenerationScene;

GenerationScene.prototype.createChildren = function () {
	this.line = new DirLine( game );
	this.add( this.line );

	this.name = new TextView( game, 'Generating archipelago', 'font12', 12, 'left' );
	this.add( this.name );
}

GenerationScene.prototype.layout = function () {

	var cy = this.reqHeight / 2;

	this.name.x = Math.floor( (this.reqWidth - this.name.width) / 2 );
	this.name.y = Math.floor( cy - this.name.height );

	this.line.draw( 
		{x: this.name.x, y: cy}, 
		{x: this.name.right, y: cy} );
}

GenerationScene.prototype.init = function () {
}

GenerationScene.prototype.step = function () {

	var tribes = Tribe.ALL.concat();
	var shuffle = (Math.random() * tribes.length) | 0;
	for (var i=0; i < shuffle; i++) {
		tribes.push( tribes.shift() );
	}
	tribes.pop();

	if (Universe.build( {nIslands: 24, tribes: tribes} )) {
		switchScene( GameScene );
	}
}