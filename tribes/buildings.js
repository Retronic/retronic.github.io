var Buildings = {};

Buildings.GARRISON = "garrison";
Buildings.SHIPYARD = "shipyard";

Buildings.ALL = [Buildings.GARRISON, Buildings.SHIPYARD];

Buildings[Buildings.GARRISON] = {
	cost	: 5,
	reqs	: []
};

Buildings[Buildings.SHIPYARD] = {
	cost	: 10,
	reqs	: [Buildings.GARRISON]
};