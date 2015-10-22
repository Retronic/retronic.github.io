function TribePanel( game ) {
	Panel.call( this, game );
}

TribePanel.prototype = Object.create( Panel.prototype );
TribePanel.prototype.constructor = TribePanel;

TribePanel.prototype.createChildren = function() {
	Panel.prototype.createChildren.call( this );

	this.title = new TextView( game, "", "font12", 12, "center" );
	this.title.y = Panel.MARGIN;
	this.add( this.title );

	this.info = new TextView( game, "", "font12", 12 );
	this.add( this.info );
}

TribePanel.prototype.layout = function() {
	Panel.prototype.layout.call( this );

	this.title.resize( this.reqWidth, 0 );

	this.info.x = Panel.MARGIN;
	this.info.y = this.title.bottom + Panel.MARGIN;
}

TribePanel.prototype.select = function( tribe, refresh ) {

	if (this.tribe == tribe && !refresh) {
		return;
	}

	this.tribe = tribe;

	this.title.text = tribe.name;
	this.title.color = tribe.color;

	if (tribe == Universe.player) {
		this.info.text =  
			"Turn: " + Universe.turn + "\n" +
			"Gold: " + tribe.gold + "\n" + 
			"Tech level: " + tribe.tech;;
	} else {
		this.info.text =  "Turn: " + Universe.turn;
	}

	this.layout();
}