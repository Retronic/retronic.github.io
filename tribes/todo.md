* Generation
	* Choose home islands one by one for each tribe for better control
	* Each home island should have at least 2 uninhabited islands within its reach
	* For each home island there shouldn't be other home islands within its reach
* Gameplay
	* A player can send no more than 1 settler to an uninhabited island (with a "colonization kit")
	* An island doesn't grow and doesn't accept new settlers until a garrison is built
	* Each island can send settlers only once a turn
	* Each island earns gold proportionally to its population
	* Sending settlers costs gold: fixed value + proportionally to the size of the fleet + equipment price
* Refactoring
	* update() in index.html
	* After a fleet arrives settlers should be "dropped" separately to show an assult, a colony foundation etc.
* UI
	* A line connecting a fleet and its destination should follow a ship icon continuously
	* Gamelog with messages like "the colony has been founded", "settlers have arrived" etc.
	* When an island is selected show all player's fleet moving to this island