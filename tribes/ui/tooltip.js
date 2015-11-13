function Tooltip( game ) {
	Panel.call( this, game );
}

Tooltip.prototype = Object.create( Panel.prototype );
Tooltip.prototype.constructor = Tooltip;

Tooltip.prototype.createChildren = function() {
	Panel.prototype.createChildren.call( this );

	this.tfTitle = game.add.bitmapText( Panel.MARGIN, Panel.MARGIN, 'font12', "", 12, this );
	this.tfTitle.smoothed = false;
	this.tfTitle.tint = 0xFFFF88;

	this.tfText = game.add.bitmapText( Panel.MARGIN, Panel.MARGIN, 'font12', "", 12, this );
	this.tfText.smoothed = false;
}

Tooltip.prototype.layout = function() {
	Panel.prototype.layout.call( this );

	this.tfText.y = this.tfTitle.y + this.tfTitle.height + Panel.LINE;
}

Tooltip.prototype.move = function( pointer, x, y, down) {
	this.x = x + Tooltip.OFFSET_X;
	if (this.right > scene.width) {
		this.x = x - this.width;
	}
	this.y = y + Tooltip.OFFSET_Y;
}

Tooltip.prototype.values = function( text, title ) {
	this.tfText.text = text;
	this.tfTitle.text = title || "";
	this.resize( 
		this.tfText.width + Panel.MARGIN*2, 
		this.tfText.height + this.tfTitle.height + Panel.MARGIN*2 + Panel.LINE );
}

Tooltip._instance = null;

Tooltip.OFFSET_X = 16;
Tooltip.OFFSET_Y = 24;

Tooltip.show = function( text, title ) {

	var tooltip = Tooltip._instance;

	if (!tooltip) {
		tooltip = Tooltip._instance = new Tooltip( game );
		scene.add( tooltip );
	} else if (tooltip.parent != scene) {
		scene.add( tooltip );
	} else {
		scene.bringToTop( tooltip );
	}

	tooltip.visible = true;
	tooltip.values( text, title );
	game.input.addMoveCallback( tooltip.move, tooltip );

	tooltip.move( game.input.mousePointer.x, game.input.mousePointer.y );
}

Tooltip.hide = function() {
	var tooltip = Tooltip._instance;
	if (tooltip) {
		tooltip.visible = false;
		game.input.deleteMoveCallback( tooltip.move, tooltip );
	}
}