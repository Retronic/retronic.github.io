var Buildings = {};

Buildings.OUTPOST	= "outpost";
Buildings.SHIPYARD	= "shipyard";
Buildings.WALLS		= "walls";
Buildings.CASTLE	= "castle";
Buildings.STOREHOUSE= "storehouse";
Buildings.SHRINE	= "shrine";
Buildings.MARKET	= "marketplace";

Buildings.FLOTILLA	= "flotilla";

// Forge Workshop Longhouse Fort Trading post

Buildings.ALL = [Buildings.OUTPOST, Buildings.SHIPYARD, Buildings.WALLS, Buildings.CASTLE, Buildings.STOREHOUSE, Buildings.SHRINE, Buildings.MARKET];

Buildings[Buildings.OUTPOST] = {
	cost	: 200,
	reqs	: []
};

Buildings[Buildings.SHIPYARD] = {
	cost	: 400,
	reqs	: [Buildings.OUTPOST]
};

Buildings[Buildings.WALLS] = {
	cost	: 400,
	reqs	: [Buildings.OUTPOST]
};

Buildings[Buildings.CASTLE] = {
	cost	: 800,
	reqs	: [Buildings.WALLS]
};

Buildings[Buildings.STOREHOUSE] = {
	cost	: 400,
	reqs	: [Buildings.OUTPOST]
};

Buildings[Buildings.SHRINE] = {
	cost	: 500,
	reqs	: [Buildings.WALLS]
};

Buildings[Buildings.MARKET] = {
	cost	: 500,
	reqs	: [Buildings.OUTPOST]
};

Buildings[Buildings.FLOTILLA] = {
	cost	: 250
};