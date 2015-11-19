function Tooltip( game ) {
	View.call( this, game );
}

Tooltip.prototype = Object.create( View.prototype );
Tooltip.prototype.constructor = Tooltip;

Tooltip.prototype.createChildren = function() {
	View.prototype.createChildren.call( this );

	this.bg = game.add.graphics( 0, 0, this );

	this.tfTitle = game.add.bitmapText( Panel.MARGIN, Panel.MARGIN, 'font12', "", 12, this );
	this.tfTitle.smoothed = false;
	this.tfTitle.tint = 0xFFFF88;

	this.tfText = game.add.bitmapText( Panel.MARGIN, Panel.MARGIN, 'font12', "", 12, this );
	this.tfText.smoothed = false;
}

Tooltip.prototype.layout = function() {
	View.prototype.layout.call( this );

	this.bg.clear();
	this.bg.beginFill( 0xFFFFFF );
	this.bg.drawRect( 0, 0, this.reqWidth, this.reqHeight );
	this.bg.beginFill( 0x222222 );
	this.bg.drawRect( 2, 2, this.reqWidth-4, this.reqHeight-4 );

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