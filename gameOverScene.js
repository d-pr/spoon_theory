class GameOverScene extends Phaser.Scene {

  constructor() {
    super({key : 'GameOverScene'});

  }


  preload(){
      this.load.image('go_btn', './go_button.png');
      this.load.image('undo_btn', './undo_button.png');

  }

  create(){

    this.undo_button = this.add.image(820, 775, 'undo_btn').setDisplaySize(240,160)
  }

}

