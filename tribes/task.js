var Task = {
	OUTPOST 	: "outpost",
	SHIPYARD	: "shipyard",
	WALLS		: "walls",
	CASTLE		: "castle",
	STOREHOUSE	: "storehouse",
	FORGE		: "forge",
	WORKSHOP	: "workshop",

	FLOTILLA	: "flotilla",
	SEIGE		: "seige flotilla"
};

Task.Buildings = [Task.OUTPOST, Task.SHIPYARD, Task.WALLS, Task.CASTLE, Task.STOREHOUSE, Task.FORGE, Task.WORKSHOP];

Task[Task.OUTPOST] = {
	cost	: 300,
	reqs	: [],
	info	: "Outpost is required to build\nanything else on an island"
};

Task[Task.SHIPYARD] = {
	cost	: 500,
	reqs	: [Task.OUTPOST],
	info	: "Shipyard enables ship\nconstruction on an island"
};

Task[Task.WALLS] = {
	cost	: 400,
	reqs	: [Task.OUTPOST],
	info	: "Walls provide additional\ndefense bonus"
};

Task[Task.CASTLE] = {
	cost	: 1500,
	reqs	: [Task.WALLS],
	info	: "Castle provides active defense, destroying\na number of attackers regardless their strength"
};

Task[Task.STOREHOUSE] = {
	cost	: 500,
	reqs	: [Task.OUTPOST],
	info	: "Storehouse increases\nan island growth rate"
};

Task[Task.FORGE] = {
	cost	: 600,
	reqs	: [Task.OUTPOST],
	info	: "Forge increases\nan island production"
};

Task[Task.WORKSHOP] = {
	cost	: 1000,
	reqs	: [Task.FORGE, Task.SHIPYARD],
	info	: "Workshop enables seige ship\nconstruction on an island"
};

Task[Task.FLOTILLA] = {
	cost	: 250,
	info	: ""
};

Task[Task.SEIGE] = {
	cost	: 600,
	info	: ""
};