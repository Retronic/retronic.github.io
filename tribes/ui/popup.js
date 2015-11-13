function PopUp( game ) {
	Panel.call( this, game );

	this.blocker.events.onInputDown.add( this.onBlocker, this );
}

PopUp.prototype = Object.create( Panel.prototype );
PopUp.prototype.constructor = PopUp;

PopUp.all = [];

PopUp.show = function( popup ) {
	scene.add( popup );
	PopUp.all.push( popup );
	return popup;
}

PopUp.layout = function() {
	for (var p in PopUp.all) {
		PopUp.all[p].layout();
	}
}

PopUp.prototype.createChildren = function() {
	this.blocker = game.add.graphics( 0, 0, this );
	this.blocker.inputEnabled = true;

	Panel.prototype.createChildren.call( this );
}

PopUp.prototype.layout = function() {
	Panel.prototype.layout.call( this );

	this.x = Math.floor( (game.width - this.width) / 2 );
	this.y = Math.floor( (game.height - this.height) / 2 );

	this.blocker.clear();
	this.blocker.beginFill( 0x000000, 0.2 );
	this.blocker.drawRect( -this.x, -this.y, game.width, game.height );
}

PopUp.prototype.destroy = function() {
	this.blocker.events.onInputDown.remove( this.onBlocker, this );
	Panel.prototype.destroy.call( this );
}

PopUp.prototype.hide = function() {
	PopUp.all.splice( PopUp.all.indexOf( this ), 1 );
	this.parent.remove( this );
	this.destroy();
}

PopUp.prototype.onBlocker = function() {
	this.onClose();
}

PopUp.prototype.onClose = function() {
	this.hide();
}