// class IntroScene extends Phaser.Scene {

//   constructor() {
//     super({key : 'IntroScene'});

//   }


//   preload(){
//       this.load.image('go_btn', './go_button.png');
//       this.load.image('undo_btn', './undo_button.png');
//       this.load.sceneFile('GameScene', './GameScene.js');


//   }

//   startGame(){
//   	console.log('in start game')
//   	this.scene.start('GameScene');
//   }

//   create(){
//     this.go_button = this.add.image(250,775, 'go_btn').setDisplaySize(240,160)
//     this.go_button.setInteractive().on('pointerdown', () => this.startGame() )
//   }

// }

