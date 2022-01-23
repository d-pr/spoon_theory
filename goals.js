    class Goals {
        constructor(num_types, num_goals){
            this.num_goals = num_goals
            this.goal_list = []

            this.num_types = num_types;

            this.type_list = ['physical', 'emotional', 'mental']

            this.physical_activities = ['Workout', 'Go Running', 'Rock Climb', 'Take a Hike']
            this.emotional_activities = ['Console a Friend', 'Deal with Breakup', 'Grab Lunch']
            this.mental_activities = ['Take an Exam', 'File Taxes', 'Organize Desk']

            this.activity_strings = [this.physical_activities, this.emotional_activities, this.mental_activities]

            this.possible_values = [15, 30, 45]
        }

        // Choose number from 0 to max
        chooseNumber(max){
            return Math.floor(Math.random() * max)
        }

        // Generate single goal
        generateGoal(i){
            // Randomly choose type and activity name
            //let type_var = this.chooseNumber(this.num_types) // One of each hardcoded
            let type_var = i
            let activity_type = this.type_list[type_var]
            let activity_name = this.activity_strings[type_var][this.chooseNumber(this.num_types)]
            // Randomly assign point value
            let point_value = this.possible_values[this.chooseNumber(this.possible_values.length)]
            // Return generated goal
            return ({
                        type: activity_type,
                        name: activity_name,
                        points: point_value
                    });
        }

        // Generate full goal list
        generateGoals(){
            for (let i = 0; i < this.num_goals; i++){
                this.goal_list.push(this.generateGoal(i));
            }
        }

        // Returns a goal list
        getGoalList(){
            return [...this.goal_list];
        }
    }