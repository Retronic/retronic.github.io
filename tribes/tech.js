function Tech() {
	this.plan = Tech.PROTO.concat();
	for (var i=0; i < 10; i++) {
		var index = Math.floor( Math.random() * (this.plan.length - 1) );
		var tmp = this.plan[index];
		this.plan[index] = this.plan[index+1];
		this.plan[index+1] = tmp;
	}
}

Tech.RANGE_UP	= "rangeUp";
Tech.SPEED_UP	= "speedUp";
Tech.ATTACK_UP	= "attackUp";

Tech.PROTO = [
	Tech.RANGE_UP,		// 2
	null,
	Tech.RANGE_UP,		// 4
	null,
	Tech.SPEED_UP,		// 6
	Tech.RANGE_UP,		// 7
	null,
	null,
	Tech.ATTACK_UP,		// 10
	Tech.RANGE_UP,		// 11
	null,
	null,
	Tech.SPEED_UP,		// 14
	Tech.ATTACK_UP,		// 15
	Tech.RANGE_UP,		// 16
	null,
	Buildings.CASTLE,	// 18
	null,
	Tech.ATTACK_UP,		// 20
	null,
	Tech.RANGE_UP,		// 22
	null,
	Tech.SPEED_UP,		// 24
]