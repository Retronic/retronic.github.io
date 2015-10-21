function Fleet( tribe, from, to, size, duration ) {

	this.id = Universe.id();

	this.tribe = tribe;
	this.from = from;
	this.to = to;
	this.size = size;
	this.duration = duration;
	this.progress = 0;

	this.x = from.x;
	this.y = from.y;

	this.isAlive = true;

	this.onChanged = new Phaser.Signal();
}

Fleet.prototype.advance = function() {

	if (this.progress >= this.duration) {
		return;
	}

	this.progress++;
	var p = this.progress / this.duration;
	this.x = this.from.x + (this.to.x - this.from.x) * p;
	this.y = this.from.y + (this.to.y - this.from.y) * p;

	if (this.progress >= this.duration) {
		this.arrive();
	}
	this.onChanged.dispatch();
}

Fleet.prototype.arrive = function() {

	this.isAlive = false;

	if (this.to.tribe == null) {

		this.to.colonize( this.tribe );
		
	} else if (this.to.tribe == this.tribe) {

		this.to.population = 
			Math.min( this.to.population + this.size, this.to.size );
		this.to.onChanged.dispatch();

	} else {

	}
}