function AssaultPopUp( game, fleet ) {

	this.fleet = fleet;

	PopUp.call( this, game );

	for (var i=0; i < fleet.size; i++) {
		var warrior = new Warrior( game, fleet.tribe );
		this.attackers.add( warrior );
	}

	for (var i=0; i < fleet.to.population; i++) {
		var warrior = new Warrior( game, fleet.to.tribe );
		this.defenders.add( warrior );
	}

//	this.name.text = fleet.to.name;
//	this.name.tint = fleet.to.tribe.color;

	if (fleet.siege || fleet.to.has( Task.CASTLE )) {
		game.time.events.add( Phaser.Timer.QUARTER, this.doAOE, this );	
	} else {
		game.time.events.add( Phaser.Timer.QUARTER, this.killOne, this );
	}

	this.resize( this.beach.width + Panel.MARGIN*2, this.beach.height + Panel.MARGIN*2 );
}

AssaultPopUp.prototype = Object.create( PopUp.prototype );
AssaultPopUp.prototype.constructor = AssaultPopUp;

AssaultPopUp.prototype.createChildren = function() {

	PopUp.prototype.createChildren.call( this );

	this.sky = game.add.tileSprite( Panel.MARGIN, Panel.MARGIN, 800, 60, 'sky', null, this );
	this.sky.autoScroll( Math.random() * 20 - 10, 0 );

	var bg;
	switch (this.fleet.to.resource) {
	case Island.Resources.STONE:
		bg = 'beach_stone';
		break;
	case Island.Resources.CLIFFS:
		bg = 'beach_cliffs';
		break;
	case Island.Resources.TIMBER:
		bg = 'beach_timber';
		break;
	case Island.Resources.GAME:
		bg = 'beach_game';
		break;
	default:
		bg = 'beach_normal';
	}
	this.beach = game.add.image( Panel.MARGIN, Panel.MARGIN, bg, null, this );
	this.beach.smoothed = false;

	this.attackers = game.add.group( this );
	this.defenders = game.add.group( this );
	this.defenders.scale.x = -1;

	this.name = game.add.bitmapText( 0, 0, 'font12', this.fleet.to.name, 12, this );
	this.name.tint = this.fleet.to.tribe.color;
	this.name.smoothed = false;

	this.atkBonus = game.add.bitmapText( 0, 0, 'font8', this.fleet.siege ? "siege flotilla" : "", 8, this );
	this.atkBonus.smoothed = false;

	var defBonus = "";
	if (this.fleet.to.has( Task.CASTLE )) {
		defBonus = "castle";
	} else if (this.fleet.to.has( Task.WALLS )) {
		defBonus = "walls";
	} else if (this.fleet.to.has( Task.OUTPOST )) {
		defBonus = "outpost";
	}
	this.defBonus = game.add.bitmapText( 0, 0, 'font8', defBonus, 8, this );
	this.defBonus.smoothed = false;
}

AssaultPopUp.prototype.layout = function() {

	PopUp.prototype.layout.call( this );

	var n1 = this.attackers.length + this.defenders.length - 2;
	this.gap = Math.floor( (this.reqWidth - Warrior.SIZE*2 - Panel.MARGIN*2) / n1 );
	if (this.gap > 16) {
		this.gap = 16;
	}
	var margin = (this.reqWidth - this.gap * n1 - Warrior.SIZE*2) / 2;

	for (var i=0; i < this.attackers.length; i++) {
		var warrior = this.attackers.children[i];
		warrior.x = margin + this.gap * i;
		warrior.y = this.reqHeight - Panel.MARGIN - Math.floor( Math.random() * 80 );
	}

	this.defenders.x = this.reqWidth;
	for (var i=0; i < this.defenders.length; i++) {
		var warrior = this.defenders.children[i];
		warrior.x = margin + this.gap * i;
		warrior.y = this.reqHeight - Panel.MARGIN - Math.floor( Math.random() * 80 );
	}

	this.attackers.sort( 'y', Phaser.Group.SORT_ASCENDING );
	this.defenders.sort( 'y', Phaser.Group.SORT_ASCENDING );

	this.name.x = Math.floor( (this.reqWidth - this.name.width) / 2 );
	this.name.y = Panel.LINE + Panel.MARGIN;

	this.atkBonus.x = this.atkBonus.y = this.defBonus.y = Panel.LINE + Panel.MARGIN;
	this.defBonus.x = this.reqWidth - Panel.LINE - Panel.MARGIN - this.defBonus.width;
}

AssaultPopUp.prototype.doAOE = function() {
	if (this.fleet.siege) {
		var damage = Math.min( this.fleet.to.population, 1 + Math.floor( (Math.random() + Math.random()) * 5 ) );
		for (var i=0; i < damage; i++) {
			var warrior = null;
			this.defenders.forEachAlive( function( w ) { 
				if (!warrior || w.x < warrior.x) {
					warrior = w;
				}
			} );
			warrior.slay();
		}
		game.add.audio( 'hit' ).play();
	}

	if (this.fleet.to.has( Task.CASTLE )) {
		var damage = Math.min( this.fleet.size, 1 + Math.floor( (Math.random() + Math.random()) * 8 ) );
		for (var i=0; i < damage; i++) {
			var warrior = null;
			this.attackers.forEachAlive( function( w ) { 
				if (!warrior || w.x < warrior.x) {
					warrior = w;
				}
			} );
			warrior.slay();
		}
		game.add.audio( 'hit' ).play();
	}

	if (this.defenders.length && this.attackers.length) {
		game.time.events.add( Phaser.Timer.QUARTER, this.killOne, this );
	} else if (this.attackers.length) {
		game.time.events.add( Phaser.Timer.SECOND, this.assaultOver, this, true );
	} else if (this.defenders.length) {
		game.time.events.add( Phaser.Timer.SECOND, this.assaultOver, this, false );
	} else {

	}
}

AssaultPopUp.prototype.killOne = function() {

	// Choosing a group which has lost a warrior this time
	var group = AssaultPopUp.attack( this.fleet ) ? this.defenders : this.attackers;

	// Removing a sprite from its group
	var warrior = null;
	group.forEachAlive( function( w ) { 
		if (!warrior || w.x > warrior.x) {
			warrior = w;
		}
	} );
	warrior.slay();

	game.add.audio( group == this.defenders ? 'hit' : 'miss' ).play();

	if (group.length) {
		// If the group is not empty, then scheduling the next "duel"
		this.tween = game.add.tween( group ).to( {x: group == this.attackers ? group.x + this.gap : group.x - this.gap}, Phaser.Timer.QUARTER, Phaser.Easing.Quadratic.In, true );
		this.tween.onComplete.add( this.killOne, this );
	} else {
		// Short delay before closing the window
		game.time.events.add( Phaser.Timer.SECOND, this.assaultOver, this, group == this.defenders );
	}
}

AssaultPopUp.prototype.assaultOver = function( attackersWin ) {

	// The island which is being assaulted
	var island = this.fleet.to;

	AssaultPopUp.aftermath( this.fleet, attackersWin, this.attackers.length || this.defenders.length );

	var callback = function() {
		scene.switchPanel( IslandMainPanel ).select( island );
	};
	if (attackersWin) {
		if (this.fleet.tribe == Universe.player) {
			gamelog.message( 4, 'You have conquered ' + island.name, callback, this );
		} else {
			gamelog.message( 5, this.fleet.tribe.name + ' have conquered ' + island.name, callback, this );
		}
	} else {
		if (this.fleet.tribe == Universe.player) {
			gamelog.message( 5, island.tribe.name + ' have repelled your attack on ' + island.name, callback, this );
		} else {
			gamelog.message( 4, 'You have repelled ' + this.fleet.tribe.name + ' attack on ' + island.name, callback, this );
		}
	}


	if (attackersWin) {
		scene.map.updateFieldOfView( Universe.player );
	}

	// Hiding the window and selecting the island on the map
	this.hide();

	// We can now proceed with the rest of the actions of the current tribe
	Universe.curTribe.state = Tribe.State.NOT_PROCESSED;
}

AssaultPopUp.prototype.onClose = function() {
}

AssaultPopUp.attack = function( fleet ) {
	// REFACTOR ME
	//     attack          defense        
	var a = Math.random() * fleet.tribe.attack;
	var b = Math.random() * fleet.to.tribe.attack;
	if (fleet.to.resource == Island.Resources.CLIFFS) {
		b *= 2;
	}
	if (fleet.to.has( Task.CASTLE )) {
		b *= 4;
	} else if (fleet.to.has( Task.WALLS )) {
		b *= 3;
	} else if (fleet.to.has( Task.OUTPOST )) {
		b *= 1.5;
	}
	return a > b;
}

AssaultPopUp.resolve = function( fleet ) {
	var attackers = Math.floor( fleet.size );
	var defenders = Math.floor( fleet.to.population );

	if (fleet.siege) {
		var damage = 1 + Math.floor( (Math.random() + Math.random()) * 5 );
		defenders = Math.max( 0, defenders - damage );
	}

	if (fleet.to.has( Task.CASTLE )) {
		var damage = 1 + Math.floor( (Math.random() + Math.random()) * 8 );
		attackers = Math.max( 0, attackers - damage );
	}

	while (attackers && defenders) {
		if (AssaultPopUp.attack( fleet )) {
			defenders--;
		} else {
			attackers--;
		}
	}

	AssaultPopUp.aftermath( fleet, attackers, attackers || defenders );
}

AssaultPopUp.aftermath = function( fleet, success, survivors ) {

	// The island which is being assaulted
	var island = fleet.to;

	if (success) {
		var defenders = island.tribe;
		// The defenders have lost. Giving their island to the attackers
		fleet.tribe.addIsland( island, survivors );

		if (island.tribe == Universe.player || defenders == Universe.player) {
			scene.map.updateFieldOfView( Universe.player );
		}

		if (!island.has( Task.OUTPOST )) {
			island.curTask = {
				name		: Task.OUTPOST, 
				progress	: 0
			};
		}
	} else {
		// The attackers have lost. Adjusting the size of population of the island
		island.population = survivors;
	}

	// Removing the fleet.
	fleet.isAlive = false;
	fleet.onChanged.dispatch();
	delete fleet.tribe.fleets[fleet.id];
}