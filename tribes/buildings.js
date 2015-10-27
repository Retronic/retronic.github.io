var Buildings = {};

Buildings.OUTPOST	= "outpost";
Buildings.SHIPYARD	= "shipyard";
Buildings.BURIAL	= "burial grounds";
Buildings.SHRINE	= "shrine";
Buildings.DOCKS		= "docks";
Buildings.MARKET	= "marketplace";

// Forge Workshop Longhouse Fort Trading post

Buildings.ALL = [Buildings.OUTPOST, Buildings.SHIPYARD, Buildings.BURIAL, Buildings.SHRINE, Buildings.DOCKS, Buildings.MARKET];

Buildings[Buildings.OUTPOST] = {
	cost	: 200,
	reqs	: []
};

Buildings[Buildings.SHIPYARD] = {
	cost	: 300,
	reqs	: [Buildings.OUTPOST]
};

Buildings[Buildings.BURIAL] = {
	cost	: 10,
	reqs	: [Buildings.OUTPOST]
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
	reqs	: [Buildings.OUTPOST]
};