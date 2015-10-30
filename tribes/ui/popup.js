function PopUp( game ) {
	Panel.call( this, game );
}

PopUp.prototype = Object.create( Panel.prototype );
PopUp.prototype.constructor = PopUp;

PopUp.all = [];

PopUp.show = function( popup ) {
	oceanTribes.add( popup );
	PopUp.all.push( popup );
	return popup;
}

PopUp.layout = function() {
	for (var p in PopUp.all) {
		PopUp.all[p].layout();
	}
}

PopUp.prototype.layout = function() {
	Panel.prototype.layout.call( this );

	this.x = (game.width - this.width) / 2;
	this.y = (game.height - this.height) / 2;
}

PopUp.prototype.hide = function() {
	this.parent.remove( this );
	PopUp.all.splice( PopUp.all.indexOf( this ), 1 );
}