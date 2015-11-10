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

	this.tech = new ProgressBar( game, "Tech" );
	this.add( this.tech );
}

TribePanel.prototype.layout = function() {
	Panel.prototype.layout.call( this );

	this.title.resize( this.reqWidth, 0 );

	this.info.x = Panel.MARGIN;
	this.info.y = this.title.bottom + Panel.MARGIN;

	this.tech.resize( this.reqWidth - Panel.MARGIN*2, RGButton.HEIGHT );
	this.tech.x = Panel.MARGIN;
	this.tech.y = this.reqHeight - this.tech.height - Panel.MARGIN;
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
			"Turn: " + Universe.turn;
		this.tech.visible = true;
		this.tech.maxValue = tribe.tech * 200;
		this.tech.value = tribe.progress;
		this.tech.label = "Tech " + tribe.tech;
	} else {
		this.info.text =  "Turn: " + Universe.turn;
		this.tech.visible = false;
	}

	this.layout();
}