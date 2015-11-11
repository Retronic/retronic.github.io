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
	this.tech.name = null;
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

		var bonus = this.tribe.tech - 1 >= this.tribe.techPlan.plan.length ? null : this.tribe.techPlan.plan[this.tribe.tech - 1];
		switch (bonus) {
		case Tech.RANGE_UP:
			this.tech.tooltip = "The next tech level will provide\ntravel distance bonus";
			break;
		case Tech.SPEED_UP:
			this.tech.tooltip = "The next tech level will provide\ntravel speed bonus";
			break;
		case Tech.ATTACK_UP:
			this.tech.tooltip = "The next tech level will provide\nmelee strength bonus";
			break;
		case null:
			this.tech.tooltip = "The next tech level won't provide\nany special bonus";
			break;
		default:
			this.tech.tooltip = "The next tech level will allow\n" + bonus + " construction";
			break;
		}

	} else {
		this.info.text =  "Turn: " + Universe.turn;
		this.tech.visible = false;
	}

	this.layout();
}