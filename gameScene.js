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

    // Hardcoded...... I hate that it's come to this
    this.goals_complete = [false, false, false];


    // Constants for spacing
    this.tileSpaceX = 50;//50;
    this.tileSpaceY = 50;//50

    // Border on left and top of screen, respectively
    this.borderX = 150;
    this.borderY = 125

    // Constants for tile sizing
    this.tileSizeX = 65;//50;
    this.tileSizeY = 65;//50

    // Color palette for line 
    // this.colors = []
    //this.colors = [0x84b83, 0x42bfdd,0xbbe6e4, 0xf0f6f6, 0xff66b3]
    this.colors = [0x0FF00, 0xA020F0, 0xFFA500]

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
    this.emotion_color = 'green'
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
      goal_txt.setColor('green')
    } else {
      goal_txt.setColor(this.mental_color)
    }
  }

  // addGoal(goal_index){
  //   console.log('adding text')
  //   console.log((2 * goal_index * this.goalSpacingX))
  //   let new_goal = this.add.text(((this.goalBorderLeft * (2 * goal_index * this.goalSpacingX))), this.goalTextY, this.goal_names[goal_index] + ": " +  this.goal_points_remaining[goal_index], 
  //                                 {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })
  //   console.log(new_goal)
  //   if (goal_index == 0){
  //     new_goal.setColor(this.physical_color)
  //   } else if (goal_index == 1) {
  //     new_goal.setColor('green')
  //   } else {
  //     new_goal.setColor(this.mental_color)
  //   }

  //   this.addGoalColor(new_goal, goal_index)

  //   this.goal_group.add(new_goal)
  // }


  // addSecondGoal(){
  //   console.log('adding text')
  //   let second_goal = this.add.text((this.goalBorderLeft * (2 * 2 * this.goalSpacingX)), this.goalTextY, this.goal_names[1] + ": " +  this.goal_points_remaining[0], 
  //                                 {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })
  //   console.log(second_goal)

  //   this.addGoalColor(second_goal, 1)

  //   this.goal_group.add(second_goal)
  // }



 // Add goal UI, etc
  addGoals(){
    // Hardcoded, sadly
    this.goal_group = this.add.group()
    this.win_sound = this.sound.add('win_sound')
    if (this.goal_points_remaining[0] > 0){
      this.first_goal = this.add.text(150, this.goalTextY, this.goal_names[0] + ": " +  this.goal_points_remaining[0], 
                                  {fontFamily: 'badcomic', fontSize: '26px' })
    } else {
      if (this.goals_complete[0] == false){
        this.win_sound.play()
        this.goals_complete[0] = true
      } 
      this.first_goal = this.add.text(150, this.goalTextY, "COMPLETED", 
                            {fontFamily: 'badcomic', fontSize: '26px' })
    }

    if (this.goal_points_remaining[1] > 0){
      this.second_goal = this.add.text(425, this.goalTextY, this.goal_names[1] + ": " +  this.goal_points_remaining[1], 
                                  {fontFamily: 'badcomic', fontSize: '26px' })
    } else {
      if (this.goals_complete[1] == false){
        this.win_sound.play()
        this.goals_complete[1] = true
      } 
      this.second_goal = this.add.text(425, this.goalTextY, "COMPLETED", 
                                  {fontFamily: 'badcomic', fontSize: '26px' })
    }

    if (this.goal_points_remaining[2] > 0){
      this.third_goal = this.add.text(700, this.goalTextY, "Console Friend" + ": " +  this.goal_points_remaining[2], 
                                  {fontFamily: 'badcomic', fontSize: '26px' })
    } else {
      if (this.goals_complete[2] == false){
        this.win_sound.play()
        this.goals_complete[2] = true
      } 
      this.third_goal = this.add.text(700, this.goalTextY, "COMPLETED", 
                                  {fontFamily: 'badcomic', fontSize: '26px' })
    }


    this.addGoalColor(this.first_goal, 0)
    this.addGoalColor(this.second_goal, 1)
    this.third_goal.setColor('green')



    //this.addGoalColor(this.third_goal, 2)



    this.goal_group.add(this.first_goal)
    this.goal_group.add(this.second_goal)
    this.goal_group.add(this.third_goal)
    // this.goal_group.maxSize = 3
    // // Add goals
    // this.addGoal(0)
    // this.addSecondGoal()
    // this.addGoal(2)
    // for (let i = 0; i < this.goal_list.length; i++){
    //   console.log('adding goal')
    //   this.addGoal(i)
    // }
    // console.log('goal group is...')
    // console.log(this.goal_group.isFull())

    // // Missing goal2 one...
    // this.goal1_txt =  this.add.text(this.goalBorderLeft, this.goalTextY, this.goal_names[0] + ": " +  this.goal_points_remaining[0], 
    //                               {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    // this.goal2_txt = this.add.text(this.goalBorderLeft + 2*this.goalSpacingX, this.goalTextY, this.goal_names[1] + ": " +  this.goal_points_remaining[1], 
    //                               {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    // // this.goal3_txt = this.add.text(this.goalBorderLeft + 2*this.goalSpacingX, this.goalTextY, this.goal_names[2] + ": " + this.goal_points_remaining[2], 
    // //                               {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })
    // this.final_goal_txt = this.add.text(this.goalBorderLeft + 4*this.goalSpacingX, this.goalTextY, this.goal_names[2] + ": " +  this.goal_points_remaining[1], 
    //                               {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    //     // this.goal3_txt = this.add.text(this.goalBorderLeft + 3*this.goalSpacingX, this.goalTextY, this.goal_names[2] + ": " + this.goal_points_remaining[2], 
    //     //                           {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })

    // // console.log('goal_txt_list')
    // // console.log(this.goal_txt_list.length)
    // // console.log(this.goal2_txt.text)
    // // console.log(this.final_goal_txt.text)
    // // // Temp enumeration to test
    // // this.addGoalColor(this.goal1_txt, 0)
    // // this.addGoalColor(this.goal2_txt, 1)
    // // this.addGoalColor(this.final_goal_txt, 2)

    // this.goal_group.add(this.goal1_txt)
    // this.goal_group.add(this.goal2_txt)
    // this.goal_group.add(this.final_goal_txt)

    // for (let i = 0; i < this.goal_txt_list.length; i++){
    //   this.addGoalColor(this.goal_txt_list[i], i)
    //   // Add to group
    //   this.goal_group.add(this.goal_txt_list[i])
    // }
    
  }


  drawSpoons(){
    for (let i = 0; i < this.matchX.getSpoons(); i++){
      this.ui_group.add(this.add.image(1080 - this.textBorderRight + 50,this.textYRight + 75 + i*(this.tileSizeX + 10), 'spoon').setDisplaySize(this.tileSizeX,this.tileSizeY))
    }
  }

  checkAllComplete(){
    for (let i = 0; i < this.goals_complete.length; i++){
      if (this.goals_complete[i] == false){
        return false
      }
    }
    return true
  }



  // has to run after get goal list!
  drawUI(){

    this.ui_group = this.add.group()
    // TRACKERS
    // --------------------------
    // Energy Trackers - each count
    this.energy_txt2 = this.add.text(this.textBorderLeft+2, this.textYLeft +2, "Energy" , { fontFamily: 'badcomic', fontSize: '24px' });
    this.energy_txt2.setColor('grey')
    this.energy_txt = this.add.text(this.textBorderLeft, this.textYLeft, "Energy" , { fontFamily: 'badcomic', fontSize: '24px' });

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
                                    {fontFamily: 'badcomic' })//.setColor();

    this.collect_txt.setColor('black')
    this.spoon_txt2 = this.add.text(1080 - this.textBorderRight + 2, this.textYRight + 2, "Spoons", 
                                    {fontFamily: 'badcomic', fontSize: '24px' })//.setColor();
    this.spoon_txt2.setColor('grey')
    // Spoon Tracker - spooncount
    this.spoon_txt = this.add.text(1080 - this.textBorderRight, this.textYRight, "Spoons", 
                                    {fontFamily: 'badcomic', fontSize: '24px' })//.setColor();
    this.spoon_txt.setColor('black')

    this.drawSpoons()





    // this.fourth_goal = this.add.text(750, this.goalTextY, "Console Friend" + ": " +  this.goal_points_remaining[2], 
    //                               {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })
    // this.addGoalColor(this.fourth_goal, 2)

    // Goal Tracker - goalcount
    // this.spoon_txt = this.add.text(1080 - this.textBorderRight, this.textYRight + 300, "Goals Completed: "  + this.matchX.getSpoons(), 
    //                                 {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '20px' })//.setColor();
    // this.spoon_txt.setColor('black')
    // RULES

    // TEMP
    // this.rules1 = this.add.text(1080/2 - 100, 750, "Go/Enter to Collect", 
    //                                 {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '18px' })//.setColor();
    // this.rules1.setColor('black')

    // this.rules2 = this.add.text(1080/2 -125, 775, "Undo/Backspace to Reset", 
    //                                 {fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '18px' })//.setColor();
    // this.rules2.setColor('black')
    // GOALS
    // -----
    // Harcoded at 3 at the moment

    // for (let i = 0; i < this.goal_list.length; i++){
    //   let goal_txt = this.add.txt(this.)
    //   this.energy_txt = this.add.text(this.textBorderLeft, this.textYLeft, "Energy" , { fontFamily: 'Verdana, Arial, Helvetica, sans-serif' });

    // }


    this.ui_group.add(this.energy_txt)
    this.ui_group.add(this.energy_txt2)

    this.ui_group.add(this.phys_txt)
    this.ui_group.add(this.mental_txt)
    this.ui_group.add(this.emotional_txt)

    this.ui_group.add(this.collect_txt)

    this.ui_group.add(this.spoon_txt)
    this.ui_group.add(this.spoon_txt2)
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
    for (let i = 0; i < this.goal_list.length; i++){
      this.goal_points_remaining[i] = this.goal_point_vals[i] - this.count_vals[i]
    }
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
      this.load.image('player', './Littleguy.png');

      // Spoon
      this.load.image('spoon', './Spoon_emphasis.png');

      // Text; 16:9 aspect ratio
      // Title
      // this.load.image('spoontxt', './Spoontxt.png')
      // this.load.image('theorytxt', './Theorytxt.png')
      this.load.image('spoontxt', './Spoonnew.png')
      this.load.image('theorytxt', './Theorynew.png')


      // BUTTONS
      this.load.image('go_btn', './go_button.png');
      this.load.image('undo_btn', './undo_button.png');

      // Game over text
      this.load.image('ohno', './Ohno.png')
      this.load.image('congrats', './congratulations.png')

      // LOADING SOUNDS
      // --------------
      // test for selection
      this.load.audio('click_sound', './click.mp3');

      this.load.audio('select_sound', './soft_click.mp3')
      this.load.audio('win_sound', './win_sound.mp3')

  }

  initializeGoals(){
    this.goals.generateGoals();
    this.goal_list = this.goals.getGoalList()



    // Update associated variables
    for (let i = 0; i < 3; i++){
      this.goal_points_remaining.push(this.goal_list[i].points)
      this.goal_point_vals.push(this.goal_list[i].points)
      this.goal_names.push(this.goal_list[i].name)
      this.goal_types.push(this.goal_list[i].type)
    }


  }

  addTitle(){
    this.title = this.add.text(273, 23, "Spoon Theory" , { fontFamily: 'badcomic', fontSize: '80px', fontStyle: 'bold'})
    this.title.setColor('grey')
    this.title = this.add.text(270, 20, "Spoon Theory" , { fontFamily: 'badcomic', fontSize: '80px', fontStyle: 'bold'})
    this.title.setColor('black')

    // this.add.image()
    // this.add.image(400, 60, 'spoontxt').setDisplaySize(240,160)// 16*15
    // this.add.image(650, 60, 'theorytxt').setDisplaySize(240,160)
  }


  loadRules ()
  {
      // let link_sound = this.sound.add('click_sound')
      // link_sound.play()

      var url = 'https://docs.google.com/document/d/1fKsGwYSWxpJx5TiOxiBLEXRsW5fxgR1KIeH4Rrd37HA/edit?usp=sharing'

      var s = window.open(url, '_blank');

      if (s && s.focus)
      {
          s.focus();
      }
      else if (!s)
      {
          window.location.href = url;
      }
  }

  loadArticle ()
  {
      // let link_sound = this.sound.add('click_sound')
      // link_sound.play()

      var url = 'https://butyoudontlooksick.com/articles/written-by-christine/the-spoon-theory/'

      var s = window.open(url, '_blank');

      if (s && s.focus)
      {
          s.focus();
      }
      else if (!s)
      {
          window.location.href = url;
      }
  }

  create ()
  {
    // ----------------------
    this.addTitle();
    // Initialize graphics
    this.graphics = this.add.graphics()
    // Generate goals
    this.initializeGoals();
    // Fill board with tiles
    this.matchX.fillBoard()
    // Draw tiles and UI
    this.drawTiles();
    this.drawUI();
    this.addGoals();
    // //this.add.image(100, 100, 'player');

    // Add buttons
    this.go_button = this.add.image(820,775, 'go_btn').setDisplaySize(240,160)
    this.undo_button = this.add.image(250, 775, 'undo_btn').setDisplaySize(240,160)

    this.go_button.setInteractive().on('pointerdown', () => this.removeTiles() )
    this.undo_button.setInteractive().on('pointerdown', () => this.undoMove() )


    this.graphics.fillStyle(0x000000, 1)
    this.graphics.fillRoundedRect(42, 47, 106,56, 9)
    this.graphics.fillStyle(0xf2f2f2, 1)
    this.graphics.fillRoundedRect(45, 50, 100,50, 8)

    this.rules_button = this.add.text(50, 50, "Rules", 
              {fontFamily: 'badcomic', fontSize: '36px' }).setColor('dark grey')



    this.rules_button.setInteractive().on('pointerdown', () => this.loadRules() )


    // // Handle player input
    this.input.on('pointerdown', this.selectTile, this); // Select a tile
    // // this.input.on('pointermove', this.drawPath, this);
    // //this.input.on('pointerup', this.removeTiles, this);
    this.input.keyboard.on('keydown_SPACE', this.removeTiles, this);
    this.input.keyboard.on('keydown_BACKSPACE', this.undoMove, this);

  }

  // // Check goals upon entering associated location
  // // SWAP TO STAR TODO
  // completeGoal(energy_type){
  //   // Check if they have enough energy
  //   if (energy_type == 'emotion'){ // Emotion
      
  //   } else if (energy_type == 'mental'){ // Mental

  //   } else { // Physical

  //   }

  //   // ????

  //   // Add abilities associated with the types of energy?


  // }


  undoMove(){
    this.undo_sound = this.sound.add('click_sound')
    this.undo_sound.play()
    this.matchX.resetPath();
    this.graphics.clear();
    this.updateUI();
  }

  // Select tiles!
  selectTile(pointer){
    // Creating sound variables
    this.select = this.sound.add('select_sound')
    // Check if valid to make a move at all
    if (this.matchX.getSpoons() > 0){
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
        this.select.play();
        // CAN ADD TWICE 
        this.matchX.addToPath(row, col);
        // Draw new path
        this.drawPath();
        this.updateCollecting();
        // This doesn't seem to fire until the second iteration...      
      }
    }
  }

  drawWinPopup(){
    this.graphics.clear()
    // dark green border
    this.graphics.fillStyle(0x013220, 1)
    this.graphics.fillRoundedRect(250, 200, 610,410, 32)

    this.graphics.fillStyle(0xFFFFFF, 1)
    this.graphics.fillRoundedRect(250, 200, 600,400, 32)

    // Add win text
    let line1 = this.add.text(395, 450, "You did everything!", 
                  {fontFamily: 'badcomic', fontSize: '36px' }).setColor(0x8B0000)
    line1.setDepth(2)

    let line2 = this.add.text(430, 500, "Now do it again tomorrow.", 
              {fontFamily: 'badcomic', fontSize: '20px' }).setColor(0xFFFFFF)
    line2.setDepth(2)

    let congrats = this.add.image(530, 350, 'congrats').setDisplaySize(500, 300)
    congrats.setDepth(2)

    let article_button = this.add.text(390, 550, "Learn more about spoon theory here.", 
          {fontFamily: 'badcomic', fontSize: '20px' }).setColor('blue')

    article_button.setDepth(2)

    article_button.setInteractive().on('pointerdown', () => this.loadArticle() )

  }

  drawLossPopup(){
    this.graphics.clear()
    this.graphics.fillStyle(0x8B0000, 1)
    this.graphics.fillRoundedRect(250, 200, 610,410, 32)

    this.graphics.fillStyle(0xFFFFFF, 1)
    this.graphics.fillRoundedRect(250, 200, 600,400, 32)

    // Add loss text

    let line1 = this.add.text(380, 400, "You ran out of spoons.", 
                  {fontFamily: 'badcomic', fontSize: '36px' }).setColor(0x8B0000)
    line1.setDepth(2)

    let line2 = this.add.text(465, 450, "Refresh to try again!", 
              {fontFamily: 'badcomic', fontSize: '20px' }).setColor(0xFFFFFF)
    line2.setDepth(2)

    let ohno = this.add.image(530, 350, 'ohno').setDisplaySize(500, 300)
    ohno.setDepth(2)

    let article_button = this.add.text(390, 500, "Learn more about spoon theory here.", 
          {fontFamily: 'badcomic', fontSize: '20px' }).setColor('blue')
    article_button.setDepth(2)

    article_button.setInteractive().on('pointerdown', () => this.loadArticle() )
  }

    // called in removetiles
 // won --> true or false for lost
  drawEndGameScreen(won){
    if (won == true){
      this.drawWinPopup()
    } else {
      this.drawLossPopup()
    }
  }





  removeTiles(){
    if (this.matchX.checkPathEmpty()){
      return;
    }
    this.remove_sound = this.sound.add('click_sound')
    this.remove_sound.play()
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
    if (this.checkAllComplete()){
      // win
      this.drawEndGameScreen(true)
    } else if (this.matchX.getSpoons() == 0){
      this.drawEndGameScreen(false)
    }
  }


  // update() {
  //   //this.drawPath();
  // }

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

  getPathColor(num, i){
    if (num == 2){
      return 0x0FF00
    } else if (num == 1) {
      return 0xA020F0
    } else if (num == 3) {
      return 0xFFA500
    } else {
      return this.colors[i % this.colors.length]
    }
  }

  //Draw lines along path
  drawPath(){
    if (this.matchX.checkPathEmpty()){
      return;
    }

    this.graphics.clear()
    // Current and start location in row,col
    let curr = [];
    let curr_coords;

    let prev = this.matchX.getPlayerPos();
    let prev_coords = this.convertToCoord(prev);

    // Draw lines between each point
    for (let i = 0; i < this.matchX.getPathSize(); i++){

      curr = this.matchX.getNthPathPos(i); // Get current location
      curr_coords = this.convertToCoord(curr)

      this.graphics.setDepth(1)
      this.graphics.beginPath();

      this.graphics.moveTo(prev_coords[1], prev_coords[0])
      // Color line
      let curr_selected = this.matchX.getEnemyNum()
      let curr_color = this.getPathColor(curr_selected, i)
      this.graphics.lineStyle(this.getLineWidth(i), curr_color) //this.colors[i % this.colors.length])
      this.graphics.lineTo(curr_coords[1], curr_coords[0])

      prev = curr
      prev_coords = curr_coords
      this.graphics.setDepth(2)
      this.graphics.strokePath();
    } // End for loop
    this.addCircles();
  }

  addCircles(){
    let curr = [];
    let curr_coords;

    // Add circles!
    for (let i = 0; i < this.matchX.getPathSize(); i++){

      curr = this.matchX.getNthPathPos(i); // Get current location
      curr_coords = this.convertToCoord(curr)
      let curr_selected = this.matchX.getEnemyNum()
      let curr_color = this.getPathColor(curr_selected, i)

      this.graphics.fillStyle(curr_color) //this.colors[i % this.colors.length])
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


