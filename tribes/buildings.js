var Buildings = {};

Buildings.OUTPOST	= "outpost";
Buildings.SHIPYARD	= "shipyard";
Buildings.WALLS		= "walls";
Buildings.CASTLE	= "castle";
Buildings.STOREHOUSE= "storehouse";
Buildings.FORGE		= "forge";

Buildings.SHRINE	= "shrine";
Buildings.MARKET	= "marketplace";

Buildings.FLOTILLA	= "flotilla";

// Forge Workshop Longhouse Fort Trading post

Buildings.ALL = [Buildings.OUTPOST, Buildings.SHIPYARD, Buildings.WALLS, Buildings.CASTLE, Buildings.STOREHOUSE, Buildings.FORGE];

Buildings[Buildings.OUTPOST] = {
	cost	: 200,
	reqs	: [],
	info	: "Outpost is required to build\nanything else on an island"
};

Buildings[Buildings.SHIPYARD] = {
	cost	: 400,
	reqs	: [Buildings.OUTPOST],
	info	: "Shipyard enables ship\nconstruction on an island"
};

Buildings[Buildings.WALLS] = {
	cost	: 400,
	reqs	: [Buildings.OUTPOST],
	info	: "Walls provide additional\ndefense bonus"
};

Buildings[Buildings.CASTLE] = {
	cost	: 800,
	reqs	: [Buildings.WALLS],
	info	: "More defense!!!"
};

Buildings[Buildings.STOREHOUSE] = {
	cost	: 400,
	reqs	: [Buildings.OUTPOST],
	info	: "Storehouse increases\nan island growth rate"
};

Buildings[Buildings.FORGE] = {
	cost	: 500,
	reqs	: [Buildings.OUTPOST],
	info	: "Forge increases\nan island production"
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
	cost	: 250,
	info	: ""
};