var Buildings = {};

Buildings.GARRISON	= "garrison";
Buildings.SHIPYARD	= "shipyard";
Buildings.BURIAL	= "burial grounds";
Buildings.SHRINE	= "shrine";
Buildings.DOCKS		= "docks";
Buildings.MARKET	= "marketplace";

// Forge Workshop Longhouse Fort Trading post

Buildings.ALL = [Buildings.GARRISON, Buildings.SHIPYARD, Buildings.BURIAL, Buildings.SHRINE, Buildings.DOCKS, Buildings.MARKET];

Buildings[Buildings.GARRISON] = {
	cost	: 5,
	reqs	: []
};

Buildings[Buildings.SHIPYARD] = {
	cost	: 10,
	reqs	: [Buildings.GARRISON]
};

Buildings[Buildings.BURIAL] = {
	cost	: 10,
	reqs	: [Buildings.GARRISON]
};

Buildings[Buildings.SHRINE] = {
	cost	: 10,
	reqs	: [Buildings.BURIAL]
};

Buildings[Buildings.DOCKS] = {
	cost	: 10,
	reqs	: [Buildings.SHIPYARD]
};

Buildings[Buildings.MARKET] = {
	cost	: 10,
	reqs	: [Buildings.GARRISON]
};