function AssaultPopUp( game, fleet ) {
	PopUp.call( this, game );

	this.fleet = fleet;

	this.attackers = [];
	for (var i=0; i < fleet.size; i++) {
		var warrior = game.add.image( 0, 0, 'warrior', fleet.tribe.flag, this );
		warrior.smoothed = false;
		this.attackers.push( warrior );
	}

	this.defenders = [];
	for (var i=0; i < fleet.to.population; i++) {
		var warrior = game.add.image( 0, 0, 'warrior', fleet.to.tribe.flag, this );
		warrior.scale.x = -1;
		this.defenders.push( warrior );
	}

	game.time.events.add( Phaser.Timer.QUARTER, this.killOne, this );

	this.resize( 800, 200 );
}

AssaultPopUp.prototype = Object.create( PopUp.prototype );
AssaultPopUp.prototype.constructor = AssaultPopUp;

AssaultPopUp.prototype.layout = function() {

	PopUp.prototype.layout.call( this );

	var n1 = this.attackers.length + this.defenders.length - 1;
	var gap = Math.floor( (this.reqWidth - 64/*sprite size*/ - Panel.MARGIN*2) / n1 );
	if (gap > 16) {
		gap = 16;
	}
	var margin = (this.reqWidth - gap * n1 - 64/*sprite size*/) / 2;

	for (var i=0; i < this.attackers.length; i++) {
		var warrior = this.attackers[i];
		warrior.x = margin + gap * i;
		warrior.y = Panel.MARGIN + Math.random() * (this.reqHeight - warrior.height - Panel.MARGIN*2);
	}

	for (var i=0; i < this.defenders.length; i++) {
		var warrior = this.defenders[i];
		warrior.x = this.reqWidth - margin - gap * i;
		warrior.y = Panel.MARGIN + Math.random() * (this.reqHeight - warrior.height - Panel.MARGIN*2);
	}

	this.sort( 'y', Phaser.Group.SORT_ASCENDING );
}

AssaultPopUp.prototype.killOne = function() {

	// Choosing a group which has lost a warrior this time
	var group = AssaultPopUp.attack( this.fleet ) ? this.defenders : this.attackers;

	// Removing a sprite from the stage and from its group
	var i = group.length - 1;
	var warrior = group[i];
	warrior.destroy();
	group.splice( i, 1 );

	game.add.audio( group == this.defenders ? 'hit' : 'miss' ).play();

	if (group.length) {
		// If the group is not empty, then scheduling the next "duel"
		game.time.events.add( Phaser.Timer.QUARTER, this.killOne, this );
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
		oceanTribes.switchPanel( IslandMainPanel ).select( island );
	};
	if (attackersWin) {
		if (this.fleet.tribe == Universe.player) {
			gamelog.message( 4, 'You have conquered ' + island.name, callback, this );
		} else {
			gamelog.message( 5, this.fleet.tribe.name + 'have conquered ' + island.name, callback, this );
		}
	} else {
		if (this.fleet.tribe == Universe.player) {
			gamelog.message( 5, island.tribe.name + ' have repelled your attack on ' + island.name, callback, this );
		} else {
			gamelog.message( 4, 'You have repelled ' + this.fleet.tribe.name + ' attack on ' + island.name, callback, this );
		}
	}


	if (attackersWin) {
		oceanTribes.map.updateFieldOfView( Universe.player );
	}

	// Hiding the window and selecting the island on the map
	this.hide();
	oceanTribes.switchPanel( IslandMainPanel ).select( island );

	// We can now proceed with the rest of the actions of the current tribe
	Universe.curTribe.state = Tribe.State.NOT_PROCESSED;
}

AssaultPopUp.attack = function( fleet ) {
	return Math.random() < 0.5;
}

AssaultPopUp.resolve = function( fleet ) {
	var attackers = Math.floor( fleet.size );
	var defenders = Math.floor( fleet.to.population );

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
			oceanTribes.map.updateFieldOfView( Universe.player );
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