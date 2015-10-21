* Generation
	* Choose home islands one by one for each tribe for better control
	* Each home island should have at least 2 uninhabited islands within its reach
	* For each home island there shouldn't be other home islands within its reach
* Gameplay
	* An island doesn't grow and doesn't accept new settlers until a garrison is built
	* Each island earns gold proportionally to its population
	* Sending settlers costs gold: fixed value + proportionally to the size of the fleet + equipment price
	* A fleet needs "colonization kit" to colonize an uninhabited island
* Refactoring
	* update() in index.html
	* After a fleet arrives settlers should be "dropped" separately to deplay an assault, a colony foundation etc.
* UI
	* Display a list of buildings on an island
	* Display a current task
	* A line connecting a fleet and its destination should follow a ship icon continuously
	* Gamelog with messages like "the colony has been founded", "settlers have arrived" etc.
	* When an island is selected show all player's fleet moving to this island
	* Move "Migrate" button to the bottom