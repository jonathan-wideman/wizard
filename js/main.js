var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);