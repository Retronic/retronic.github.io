function TechPopUp( game, tribe ) {
	this.tribe = tribe;
	PopUp.call( this, game );
}

TechPopUp.prototype = Object.create( PopUp.prototype );
TechPopUp.prototype.constructor = TechPopUp;

TechPopUp.prototype.createChildren = function() {
	PopUp.prototype.createChildren.call( this );

	var num = game.add.bitmapText( Panel.MARGIN, Panel.MARGIN, 'font12', "1", 12, this );
	num.smoothed = false;

	var bonus = game.add.bitmapText( Panel.MARGIN + 25, num.y, 'font12', "-", 12, this );
	bonus.smoothed = false;

	var w = 0;
	for (var i=0; i < this.tribe.techPlan.plan.length; i++) {
		var item = this.tribe.techPlan.plan[i];

		num = game.add.bitmapText( Panel.MARGIN, Panel.MARGIN + i*20 + 20, 'font12', (i + 2).toString(), 12, this );
		num.smoothed = false;

		bonus = game.add.bitmapText( Panel.MARGIN + 25, num.y, 'font12', "", 12, this );
		bonus.smoothed = false;
		switch (item) {
		case Tech.RANGE_UP:
			bonus.text = "+Travel distance";
			break;
		case Tech.SPEED_UP:
			bonus.text = "+Travel speed";
			break;
		case Tech.ATTACK_UP:
			bonus.text = "+Melee strength";
			break;
		case null:
			bonus.text = "-";
			break;
		default:
			bonus.text = item[0].toUpperCase() + item.substr( 1 );
			break;
		}

		if (this.tribe.tech - 1 < i) {
			bonus.tint = 0x888888;
		} else if (this.tribe.tech - 1 == i) {
			bonus.tint = 0xFFFF88;
		}

		if (bonus.x + bonus.width > w) {
			w = bonus.x + bonus.width;
		}
	}

	this.resize( w + Panel.MARGIN, bonus.y + bonus.height + Panel.MARGIN );
}