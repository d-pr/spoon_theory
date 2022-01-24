
    class MatchX {
        /* CONSTRUCTOR: Set the initial parameters, either from a provided object
        *  or to default values.
        *  
        *  Paramaters:
        *  Rows = Number of rows on board. Int.
        *  Cols = Number of cols on board. Int.
        *  Num_Colors = Number of different colors of enemies. Int.
        *  Player_Pos = Player's initial position. Array of 2,
        *               first pos. is x, second is y.
        *  Addition (later): Other enemy positions
        * 
        *  Path = Holds currently selected matched enemies. Array
        * 		  of ??? (enemy objects?).
        */

        // Tiles:
        // -1 empty;
        // 0 player
        // 1 mental
        // 2 emotional
        // 3 physical
        // 10 rainbow
        // 11 nap
        // 20 mental goal
        // 21 emotional goal
        // 22 physical goal
        constructor(obj){
            // Initialize values
            // Either set default values, or...
            if (obj == undefined){
                obj = {};
                this.rows = 10;
                this.cols = 16;
                this.num_colors = 3;
                this.player_pos = [Math.floor(Math.random() * this.rows), 
                                   Math.floor(Math.random() * this.cols)]// [this.rows - 1, this.cols -1]; // array of 2, [x, y]

                // Record # of each resource collected
                this.emotionalCount = 0
                this.physicalCount = 0
                this.mentalCount = 0

                // Number of spoons remaining
                this.spoonCount = 6

            } else {
            // ... set based on the object
                this.rows = obj.rows;
                this.cols = obj.cols;
                this.num_colors = obj.num_colors;
                this.player_pos = obj.player_pos;



                // Number of spoons remaining
                this.spoonCount = obj.spoonCount
            }

            // Create the 'path' array - store match path as its drawn
            // Holds arrays of [x,y] positions of enemies
            this.path = [];

            // Record # of each resource collected
            this.emotionCount = 0
            this.physicalCount = 0
            this.mentalCount = 0

            this.num_special_tiles = 2

            // Stores the values for the board - enemies etc
            // -1 = Empty
            // 0 = Player
            // 1 -> n = Enemies, up to n types
            // Board indexing:
            // 0, 0 is bottom left

            // n_cols
            // ...
            // 2
            // 1
            // 0 1 2 ... n_rows
            this.board_array = [];

            // Track the current enemy being matched (1, ..., n)
            // -1 if there's no current match!
            this.curr_enemy = -1;

        } // END constructor

        /* Getters and Setters for Constructor */

        getRows(){
            return this.rows;
        }

        getCols(){
            return this.cols;
        }

        getNumColors(){
            return this.num_colors;
        }

        getPath(){ // Maybe not neccessary?
            return this.path;
        }

        // Gets the CURRENT enemy
        getEnemyNum(){
            return this.curr_enemy;
        }

        // Sets current enemy value
        setEnemyNum(num){
            this.curr_enemy = num;
        }

        // Helper for adding enemies to board -
        // Returns integer from 1 to num_colors
        // 10% chance of special tile
        // 90% chance of regular tile


        // Tiles:
        // -1 empty;
        // 0 player
        // 1 mental
        // 2 emotional
        // 3 physical
        // 10 rainbow
        // 11 nap
        // 20 mental goal
        // 21 emotional goal
        // 22 physical goal
        getRandomTile(){
            // Determine if regular or special tile - too many
            if (Math.floor((Math.random() * 100)) > 95){ // Special tile, 5%?
                console.log('special tile');
                return (Math.floor((Math.random() * this.num_special_tiles)) + 10); // Special starts at 10
            } else { // Regular tile
                return Math.floor((Math.random() * this.num_colors) + 1); // Colors start at 1
            }
        }

        // Get the value of a given position in the board
        getTileAt(row, col) {
            let val = this.board_array[row][col];
            return val;
        }

        // Swap two tiles at row1, col1 and row2, col2
        swapTiles(row1, col1, row2, col2){
            let temp_val = this.board_array[row1][col1]
            this.board_array[row1][col1] = this.board_array[row2][col2]
            this.board_array[row2][col2] = temp_val
        }

        checkEmpty(row, col){
            if (this.board_array[row][col] == -1){
                return true;
            } else {
                return false;
            }
        }

        getPlayerPos(){
            let val = [...this.player_pos];
            return val;
        }

        // ----------------------------------------
        // Getters and setters for various resources
        // -----------------------------------------

        getSpoons(){
            return this.spoonCount;
        }

        removeSpoon(){
            this.spoonCount--;
        }

        addSpoon(){
            this.spoonCount++;
        }


        // Mental/emotional/physical
        // -------------------------
        getMentalCount(){
            return this.mentalCount;
        }

        addMentalCount(num){
            this.mentalCount = this.mentalCount + num;
        }

        subtractMentalCount(num){
            this.mentalCount = this.mentalCount - num;
        }


        getEmotionalCount(){
            return this.emotionalCount;
        }

        addEmotionalCount(num){
            this.emotionalCount = this.emotionalCount + num;
        }

        subtractEmotionalCount(num){
            this.emotionalCount = this.emotionalCount - num;
        }


        getPhysicalCount(){
            return this.physicalCount;
        }

        addPhysicalCount(num){
            this.physicalCount = this.physicalCount + num;
        }

        subtractPhysicalCount(num){
            this.physicalCount = this.physicalCount - num;
        }

        /* Fills the board with values between 1 and 4, then adds
        *  the player position.
        *  As per above, board is a 2D array.
        */
        fillBoard(){
            // Add enemies to the board...
            for (let i = 0; i < this.rows; i++){
                // Populate row array with random enemies...
                let new_arr = [];
                for (let j = 0; j < this.cols; j++){
                    new_arr.push(this.getRandomTile());
                }
                // Add the row to the ith column...
                this.board_array.push(new_arr);
            }
            // Add the player position.
            this.board_array[this.player_pos[0]][this.player_pos[1]] = 0; // Set to 0 to indicate
            // TODO -- add the positions of the goal buildings
        }

        // Removes tiles in path from board
        // Records the new values of various colors
        removeTiles(){
            console.log('in remove tiles')
            console.log(this.path)
            console.log(this.path.length)
            let len = this.path.length;
            // Reset the current enemy
            console.log('resetting current enemy')
            this.curr_enemy = -1;
            // Every tile in chain
            for (let i = 0; i < len; i++){
                console.log('i is...')
                console.log(i)
                // Remove end of path
                let coords = this.path.pop()
                console.log('coords are...')
                console.log(coords[0])
                console.log(coords[1])

                // Add resource based on the type
                switch(this.getTileAt(coords[0], coords[1])){
                    case 1:
                        this.addMentalCount(1)
                        break;
                    case 2:
                        this.addEmotionalCount(1)
                        break;
                    case 3:
                        this.addPhysicalCount(1)
                        break;
                    // Special tiles
                    case 11: // Nap adds a spoon!
                        this.addSpoon();
                }

                // Set the tile to new value
                if (i == 0){
                    console.log('resetting player')
                    this.board_array[coords[0]][coords[1]] = 0 // For last tile, update player position!
                    this.board_array[this.player_pos[0]][this.player_pos[1]] = -1 // Empty previous spot
                    // Update player position
                    this.player_pos = [coords[0], coords[1]]
                } else {
                    console.log('resetting other')
                    this.board_array[coords[0]][coords[1]] = -1 // Otherwise set empty
                }

            }
        }

        // Helper for makeTilesFall
        // Gets number of empty spaces below a tile
        getFreeSpacesBelow(row, col){
            let spaces = 0;
            if (row != this.getRows()){
                for (let i = row + 1; i < this.getRows(); i++){
                    if (this.checkEmpty(i, col)){
                        spaces++;
                    }
                }
            }
            return spaces;
        }

        // TODO: treat stationary tiles the same way as the player
        // Called after removeTiles, makes them 'fall'
        makeTilesFall(){
            // Start at the second to last row, going up
            for (let i = this.getRows() - 2; i >= 0; i--){
                for (let j = 0; j < this.getCols(); j++){
                    // Check if it's the player, otherwise it'll fall
                    if (!this.overlapsPlayer(i, j)){
                        let free_spaces_below = this.getFreeSpacesBelow(i, j)
                        // Adjust for player location (since there can be free spaces below)
                        if (j == this.player_pos[1] && i < this.player_pos[0]){
                            free_spaces_below++;
                            if (i + free_spaces_below <= this.player_pos[0]){
                                free_spaces_below--;
                            }
                        }
                        // Swap the tiles down
                        if (!this.checkEmpty(i, j) && free_spaces_below > 0){
                            this.swapTiles(i, j, i + free_spaces_below, j)
                        }
                    }
                }
            }
        }


        replenishTiles(){
            for (let i = 0; i < this.getRows(); i++){
                for (let j = 0; j < this.getCols(); j++){
                    // If tile is empty, generate an enemy
                    if (this.checkEmpty(i, j)){
                        this.board_array[i][j] = this.getRandomTile();
                    }
                }
            }
        }


        /* **********************
            Helpers for the PATH 
        ************************* */

        resetPath(){
            this.path = []
            this.curr_enemy = -1;
        }

        // Pops off the last entry in the path
        removeFromPath(){
        	this.path = this.path.pop();
        }
        // Adds a row, column pair (location on the board) to the
        // 'path' array.
        addToPath(row, col){
            let pos_arr = [row, col];
            if (!this.checkIfInPath(row, col)){
            	this.path.push(pos_arr);
                // Update curr color, unless it's a non-rainbow special tile
                if (this.getTileAt(row, col) != 11){
                    this.curr_enemy = this.getTileAt(row, col);
                }
            }
        }

        // Returns the position of the most recently selected enemy
        getLastSelection(){
            console.log('in get last selection')
            console.log(this.path)
            console.log(this.path[0])
            console.log(this.path[this.path.length - 1])
            // console.log(type(this.path[this.path.length - 1]))
            let last_selection = this.path[this.path.length - 1] // [... xxx] this instead?
            return last_selection;
        }

        // Get the size of the path (# enemies)
        getPathSize(){
            return this.path.length;
        }

        // If you go back one, deselect that tile
        checkBacktrack(row, col){
        	// First, check if there's even any tiles in path
        	if (this.checkPathEmpty()){
        		return false;
        	}
        	// Check to see if we've clicked the previous tile
        	let prev = this.getLastSelection();
        	if (prev[0] == row && prev[1] == col){
        		return true;
        	} else {
        		return false;
        	}
        }

        // Check if the path is empty
        checkPathEmpty(){
            if (this.getPathSize() == 0){
                return true;
            } else {
                return false;
            }
        }
        
        // Gets the enemy in the nth position FROM THE FRONT
        // in the path.
        // Returns -1 on failure (i.e., n > path length, or n < 0)
        getNthPathPos(n){
            if (n >= 0 && n < this.path.length){
                let nth_val = [...this.path[n]]
                return nth_val;
            } else {
                return -1;
            }
        }

        // Check if a row, col combo is already in the path
        // Returns true if position already in path, false if not
        // Could use a set instead
        checkIfInPath(row, col){
            // Check for matches...
            for (let i = 0; i < this.path.length; i++){
                if (this.path[i][0] == row && this.path[i][1] == col){
                    return true; // If found, return true
                }
            }
            // If no matches, return false
            return false;
        }

        // Checks if the given enemy matches the enemy
        // currently being matched.
        // If there's no enemy currently being matched, returns
        // true as well.
        checkMatch(row, col){
            console.log('in check match')
            console.log(this.board_array[row][col])
            console.log(this.curr_enemy)
            // Either matches current enemy, is a special column, or no current enemy
            // selected
            if (this.board_array[row][col] == this.curr_enemy || this.board_array[row][col] == 10 || this.board_array[row][col] == 11 ||
                this.curr_enemy == -1 || this.curr_enemy == 10){
                return true;
            } else {
                return false;
            }
        }

        // Checks if the selected position is valid, i.e., in bounds.
        // Returns true if valid, false if not.
        checkInBounds(row, col){
            if (row >= 0 && row < this.rows &&
                col >= 0 && col < this.cols){
                return true;
            } else {
                return false;
            }
        }

        // Returns true if it overlaps the player, false if not
        overlapsPlayer(row, col){
            if (this.player_pos[0] == row && this.player_pos[1] == col){
                return true;
            } else {
                return false;
            }
        }

        // Checks if the selected position is valid
        // Not out of bounds
        // If there's a current path, not adjacent to it
        // True if valid, false if not
        checkIfValid(row, col){
            // Check if out of bounds...
            if (!this.checkInBounds(row, col)){
                return false;
            }
            // Check for player position...
            if (this.overlapsPlayer(row, col)){
                return false;
            }
            // Check to see if it matches
            if (!this.checkMatch(row, col)){
                console.log('returning false')
                return false;
            }
            // Check if it's already selected
            if (this.checkIfInPath(row, col)){
                return false;
            }
            let last_pos = [];

            // Find the last position - either in the path, or the player
            if (this.checkPathEmpty()){
                last_pos = this.player_pos;
            } else {
                last_pos = this.getLastSelection();
                console.log(last_pos)
            }

            // Check to see if the new position is adjacent to current one			// row_new = row - 1, row + 1, row
            // col_new = col - 1, col + 1, col

            // Could be <= 1, >= -1 instead!
            if (
                ((last_pos[0] - row) == 1 || (last_pos[0] - row) == -1 || (last_pos[0] - row) == 0) &&
                ((last_pos[1] - col) == 1 || (last_pos[1] - col) == -1 || (last_pos[1] - col) == 0)
                ){
                return true;
            } else {
                return false;
            }
        }

    } // END Match3 Class
