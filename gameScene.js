// import Phaser from './phaser.js';
// TODO - missing middle goal (index 1)
// TODO - goals aren't correctly resetting
// TODO - mental and emotional in the goal update are mixed up!
// TODO - all iteration through types of enemies should be 1-3, not 0-2, to keep consistent imo
class GameScene extends Phaser.Scene {

  constructor() {
    super({key : 'GameScene'});
    this.matchX = new MatchX()

    this.goals = new Goals(this.matchX.getNumColors(), 3)
    // Hardcoded at 3 atm
    // List of goals, with same indices as remaining points
    this.goal_list = [];
    this.goal_types = []
    this.goal_names = []

    this.goal_point_vals = []
    this.goal_points_remaining = []

    // Constants for spacing
    this.tileSpaceX = 50;
    this.tileSpaceY = 50

    // Border on left and top of screen, respectively
    this.borderX = 135;
    this.borderY = 125

    // Constants for tile sizing
    this.tileSizeX = 50;
    this.tileSizeY = 50

    // Color palette for line 
    // this.colors = []
    this.colors = [0x84b83, 0x42bfdd,0xbbe6e4, 0xf0f6f6, 0xff66b3]

    // Constants for text
    // TRACKERS
    this.textBorderLeft = 15
    this.textSpacing = 25
    this.textYLeft = 125

    this.textBorderRight = 125
    this.textYRight = 125

    // Goals
    this.goalTextY = 650;
    this.goalBorderLeft = 150;
    this.goalSpacingX = 125;

    // Colors for text
    this.mental_color = '#4A0688'
    this.emotion_color = '#386B58'
    this.physical_color = '#E55B24'

    // Add can take action, so you don't do stuff during animation
  }

  // generateLinePalette(){
  //   for (const hex_string in this.color_strings){
  //     this.colors.push(Phaser.Display.Color.HexStringToColor(hex_string).color)  
  //   }
  //   //var color = Phaser.Display.Color.HexStringToColor(hex).color;
  // }
  // ----------------
  // Helper functions 
  // ================



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
  // Draws tiles from the board array in the MatchX object
  drawTiles(){
    // Pop-in animation!!!
    this.tile_group = this.add.group();

    for (let i = 0; i < this.matchX.getRows(); i++){
        for (let j = 0; j < this.matchX.getCols(); j++){
          let img;
          switch(this.matchX.getTileAt(i, j)){
            // Player (0)
              case 0:
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                                  i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'player').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              // Regular Tiles (1...3)
              case 1: // Mental
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                                  i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'mental').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              case 2: // Emotion
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'emotion').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              case 3: // Physical
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'physical').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              // Special tiles (10...19)
              case 10: // Rainbow
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'rainbow_tile').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              case 11: // Nap
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'nap_tile').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              // Goal tiles (20...29)
              case 20: // Mental goal
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'mental_goal').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              case 21: // Emotion goal
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'emotion_goal').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;
              case 22: // Physical goal
                  img = this.add.image(j*this.tileSizeX + this.borderX + this.tileSizeX/2,
                    i*this.tileSizeY + this.borderY + this.tileSizeY/2, 'physical_goal').setDisplaySize(this.tileSizeX,this.tileSizeY);
                  break;


          }
            this.tile_group.add(img);
        }
    }
  }

  // Color goals appropriately
  addGoalColor(goal_txt, goal_num){
    if (this.goal_types[goal_num] == 'physical'){
      goal_txt.setColor(this.physical_color)
    } else if (this.goal_types[goal_num] == 'emotional'){
      goal_txt.setColor(this.emotional_color)
    } else {
      goal_txt.setColor(this.mental_color)
    }
  }


 // Add goal UI, etc
  addGoals(){
    this.goal_group = this.add.group()

    // Missing goal2 one...
    this.goal1_txt =  this.add.text(this.goalBorderLeft, this.goalTextY, this.goal_names[0] + ": " +  this.goal_points_remaining[0], 
                                  {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    this.goal2_txt = this.add.text(this.goalBorderLeft + 1*this.goalSpacingX, this.goalTextY, this.goal_names[1] + ": " +  this.goal_points_remaining[1], 
                                  {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    this.goal3_txt = this.add.text(700/*this.goalBorderLeft + 2*this.goalSpacingX*/, this.goalTextY, this.goal_names[2] + ": " + this.goal_points_remaining[2], 
                                  {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    this.goal_txt_list = [this.goal1_txt, this.goal2_txt, this.goal3_txt]
    console.log('goal_txt_list')
    console.log(this.goal_txt_list.length)
    console.log(this.goal2_txt.text)
    // Temp enumeration to test
    this.addGoalColor(this.goal1_txt, 0)
    this.addGoalColor(this.goal2_txt, 1)
    this.addGoalColor(this.goal3_txt, 2)

    this.goal_group.add(this.goal1_txt)
    this.goal_group.add(this.goal2_txt)
    this.goal_group.add(this.goal3_txt)

    // for (let i = 0; i < this.goal_txt_list.length; i++){
    //   this.addGoalColor(this.goal_txt_list[i], i)
    //   // Add to group
    //   this.goal_group.add(this.goal_txt_list[i])
    // }
    
  }


  // has to run after get goal list!
  drawUI(){
    this.ui_group = this.add.group()
    // TRACKERS
    // --------------------------
    // Energy Trackers - each count
    this.energy_txt = this.add.text(this.textBorderLeft, this.textYLeft, "Energy" , { fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' });
    this.phys_txt = this.add.text(this.textBorderLeft, (this.textYLeft + 2*this.textSpacing), "Physical: " + this.matchX.getPhysicalCount(), 
                                  {fontFamily: 'Verdana, Arial, Helvetica, sans-serif' })//.setColor(this.physical_color);
    this.mental_txt = this.add.text(this.textBorderLeft, (this.textYLeft + 3*this.textSpacing), "Mental: " + this.matchX.getMentalCount(), 
                                  {fontFamily: 'Verdana, Arial, Helvetica, sans-serif' })//.setColor(this.mental_color);
    this.emotional_txt = this.add.text(this.textBorderLeft, (this.textYLeft + 4*this.textSpacing), "Emotional: " + this.matchX.getEmotionalCount(), 
                                  {fontFamily: 'Verdana, Arial, Helvetica, sans-serif' })//.setColor(this.emotional_color);
    this.energy_txt.setColor('black')

    // Updating colors
    this.phys_txt.setColor(this.physical_color)
    this.mental_txt.setColor(this.mental_color)
    this.emotional_txt.setColor(this.emotion_color)

    // Current Path Tracker - path size
    this.collect_txt = this.add.text(this.textBorderLeft, (this.textYLeft + 6*this.textSpacing), "Collecting: " + this.matchX.getPathSize(), 
                                    {fontFamily: 'Verdana, Arial, Helvetica, sans-serif' })//.setColor();

    this.collect_txt.setColor('black')

    // Spoon Tracker - spooncount
    this.spoon_txt = this.add.text(1080 - this.textBorderRight, this.textYRight, "Spoons: "  + this.matchX.getSpoons(), 
                                    {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })//.setColor();
    this.spoon_txt.setColor('black')
    // GOALS
    // -----
    // Harcoded at 3 at the moment

    // for (let i = 0; i < this.goal_list.length; i++){
    //   let goal_txt = this.add.txt(this.)
    //   this.energy_txt = this.add.text(this.textBorderLeft, this.textYLeft, "Energy" , { fontFamily: 'Verdana, Arial, Helvetica, sans-serif' });

    // }


    this.ui_group.add(this.energy_txt)
    this.ui_group.add(this.phys_txt)
    this.ui_group.add(this.mental_txt)
    this.ui_group.add(this.emotional_txt)

    this.ui_group.add(this.collect_txt)

    this.ui_group.add(this.spoon_txt)
  } 

  updateUI(){
    // Clear and replace UI
    this.ui_group.clear(true, true)
    this.drawUI()
  }

  updateGoals(){
    this.goal_group.clear(true, true)
    this.count_vals = [this.matchX.getPhysicalCount(), this.matchX.getMentalCount(), this.matchX.getEmotionalCount()]
    // always ordered physical - mental - emotional, as per goals.js class constructor/functions!
    for (let i = 0; i < this.goal_list.length; i++)
      this.goal_points_remaining[i] = this.goal_point_vals[i] - this.count_vals[i]

    // this.goal1_txt.setText(String(this.goal_names[0] + ": " + this.goal_points_remaining[0]))
    // this.goal2_txt.setText(String(this.goal_names[1] + ": " + this.goal_points_remaining[1]))
    // this.goal3_txt.setText(String(this.goal_names[2] + ": " + this.goal_points_remaining[2]))
    this.addGoals();
  }

  updateCollecting(){
    this.collect_txt.setText("Collecting: " + this.matchX.getPathSize())
  }


// ----------------
// Main Functions
// =================

  // init() {
    
  // };

  preload ()
  {
      // LOADING IMAGES
      // -------------
      // Regular tiles; square
      this.load.image('emotion', './Heart.png');
      this.load.image('physical', './Arm.png');
      this.load.image('mental', './Brain.png');

      // Goal tiles; square
      this.load.image('emotion_goal', './EmotionGoal.png')
      this.load.image('physical_goal', './PhysicalGoal.png')
      this.load.image('mental_goal', './MentalGoal')


      // Power up tiles; square
      this.load.image('rainbow_tile', './RainbowTile.png') // Change colors
      this.load.image('nap_tile', './NapTile.png') // Gain a spoon; any color
      // nap --> gain a spoon?
      // TODO phone a friend --> collect nearby?
      // reset --> swap colors

      
      // Player
      this.load.image('player', './Spoon_emphasis.png');

      // Text; 16:9 aspect ratio
      // Title
      this.load.image('spoontxt', './Spoontxt.png')
      this.load.image('theorytxt', './Theorytxt.png')

      // LOADING SOUNDS
      // --------------
      // test for selection
      this.load.audio('click_sound', './sounds/click.mp3');

  }

  initializeGoals(){
    this.goals.generateGoals();
    this.goal_list = this.goals.getGoalList()
    console.log(this.goal_list)
    console.log(this.goal_list[0].name)


    // Update associated variables
    for (let i = 0; i < this.goal_list.length; i++){
      console.log(i)
      this.goal_points_remaining.push(this.goal_list[i].points)
      this.goal_point_vals.push(this.goal_list[i].points)
      this.goal_names.push(this.goal_list[i].name)
      this.goal_types.push(this.goal_list[i].type)
    }
    console.log(this.goal_points_remaining)
    console.log(this.goal_names)
    console.log(this.goal_types)

  }

  addTitle(){
    this.add.image()
    this.add.image(425, 60, 'spoontxt').setDisplaySize(240,135)// 16*15
    this.add.image(675, 60, 'theorytxt').setDisplaySize(240,135)
  }

  create ()
  {

    // ----------------------
    this.addTitle();
    // Initialize graphics
    this.graphics = this.add.graphics()
    // Generate goals
    this.initializeGoals();
    console.log(this.goal_list)
    // Fill board with tiles
    this.matchX.fillBoard()
    // Draw tiles and UI
    this.drawTiles();
    this.drawUI();
    this.addGoals();
    // //this.add.image(100, 100, 'player');

    // // Handle player input
    this.input.on('pointerdown', this.selectTile, this); // Select a tile
    // // this.input.on('pointermove', this.drawPath, this);
    // //this.input.on('pointerup', this.removeTiles, this);
    this.input.keyboard.on('keydown_SPACE', this.removeTiles, this);
  }

  // Check goals upon entering associated location
  // SWAP TO STAR
  completeGoal(energy_type){
    // Check if they have enough energy
    if (energy_type == 'emotion'){ // Emotion
      
    } else if (energy_type == 'mental'){ // Mental

    } else { // Physical

    }

    // ????

    // Add abilities associated with the types of energy?


  }


  // Select tiles!
  selectTile(pointer){
    // Creating sound variables
    this.click = this.sound.add('click_sound')
    // Check if valid to make a move at all
    if (this.matchX.getSpoons() > 0){
      console.log('in selectTile');
      let row = Math.floor((pointer.y - this.borderY)/this.tileSizeY);
      let col = Math.floor((pointer.x - this.borderX)/this.tileSizeX);
      //Check for deselect - TODO
      // if (this.matchX.checkBacktrack(row, col)){
      //   console.log('backtrack')
      //   this.matchX.removeFromPath();
      //   console.log(this.matchX.getPathSize())
      //   // Draw new path
      //   this.drawPath();
      //   this.updateCollecting();
      // }
      if (this.matchX.checkIfValid(row, col)){
        console.log('valid')
        this.click.play();
        // CAN ADD TWICE 
        this.matchX.addToPath(row, col);
        console.log(this.matchX.getPathSize())
        // Draw new path
        this.drawPath();
        this.updateCollecting();
        // This doesn't seem to fire until the second iteration...      
      }
    }
  }


  removeTiles(){
    if (this.matchX.checkPathEmpty()){
      return;
    }
    this.graphics.clear();
    // Use up a spoon
    this.matchX.removeSpoon();
    // Set tiles to empty, update player
    this.matchX.removeTiles();
    // Update goal progress
    this.goal_group.clear(true, true);
    this.updateGoals();
    // Make tiles fall to fill spaces
    this.matchX.makeTilesFall();
    // Replenish missing tiles
    this.matchX.replenishTiles();
    // Clear the board
    this.tile_group.clear(true, true);
    // Redraw the board
    this.drawTiles();
    this.updateUI();
  }


  update() {
    //this.drawPath();
  }

  // Helpers to go from row/column to coordinates
  rowToCoord(row){
    return row*this.tileSizeY + this.borderY + this.tileSizeY/2;
  }

  colToCoord(col){
    return col*this.tileSizeX + this.borderX + this.tileSizeX/2;
  }

  // not right!
  // Converts array of shape [row, col] to coordinates
  convertToCoord(arr){
    arr[0] = this.rowToCoord(arr[0])
    arr[1] = this.colToCoord(arr[1])
    return arr
  }

  //Draw lines along path
  drawPath(){
    if (this.matchX.checkPathEmpty()){
      return;
    }
    console.log('begin of draw path player last')
    console.log(this.matchX.getLastSelection());

    this.graphics.clear()
    // Current and start location in row,col
    let curr = [];
    let curr_coords;

    let prev = this.matchX.getPlayerPos();
    let prev_coords = this.convertToCoord(prev);

    // Draw lines between each point
    for (let i = 0; i < this.matchX.getPathSize(); i++){
      console.log('i is')
      console.log(i)
      curr = this.matchX.getNthPathPos(i); // Get current location
      curr_coords = this.convertToCoord(curr)

      this.graphics.setDepth(1)
      this.graphics.beginPath();

      this.graphics.moveTo(prev_coords[1], prev_coords[0])
      // Color line
      this.graphics.lineStyle(this.getLineWidth(i), this.colors[i % this.colors.length])
      this.graphics.lineTo(curr_coords[1], curr_coords[0])

      prev = curr
      prev_coords = curr_coords
      this.graphics.setDepth(2)
      this.graphics.strokePath();
    } // End for loop
    console.log('out of for loop')
    this.addCircles();
  }

  addCircles(){
    let curr = [];
    let curr_coords;

    // Add circles!
    for (let i = 0; i < this.matchX.getPathSize(); i++){
      console.log('i is')
      console.log(i)
      curr = this.matchX.getNthPathPos(i); // Get current location
      curr_coords = this.convertToCoord(curr)
      this.graphics.fillStyle(this.colors[i % this.colors.length])
      this.graphics.fillCircle(curr_coords[1], curr_coords[0], this.getLineWidth(i))
    } // End for loop
  }

  getLineWidth(i){
    if (i == 0){
      return 1;
    } else if (i < 5){
      return (i + 1) * 1;
    } else {
      return 6 * 1;
    }
  }


} // END CLASS

// export default GameScene;


  // // If we're making a path, draw it!
  // drawPath(pointer){
  //   if (!this.matchX.checkPathEmpty() && this.matchX.getSpoons() > 0){
  //     let row = Math.floor((pointer.y - this.borderY)/this.tileSizeY);
  //     let col = Math.floor((pointer.x - this.borderX)/this.tileSizeX);
  //     // Deselect most recent
  //     if (this.matchX.checkBacktrack(row, col)){
  //       this.matchX.removeFromPath();
  //       console.log(this.matchX.getPathSize())
  //       return;
  //     }
  //     if (this.matchX.checkIfValid(row, col)){
  //       this.matchX.addToPath(row,col);
  //       console.log('valid drag')
  //       console.log(this.matchX.getPathSize())
  //       return;

  //     }
  //     // Add check to see if it's already in path
  //   }
  // }
