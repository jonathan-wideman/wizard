var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    //this.game.load.image('player', '/assets/gfx/player.png');
    this.game.load.spritesheet('player', 'assets/img/magi.png', 32, 32)
    this.game.load.image('bullet', 'assets/img/tanks/bullet.png');
    this.game.load.spritesheet('explosion', 'assets/img/tanks/explosion.png', 64, 64, 23);

    game.load.tilemap('map', 'assets/maps/map-desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/img/tiles/tmw_desert_spacing.png');

    game.load.audio('shoot', 'assets/sfx/shoot.wav');
};

// Setup the example
GameState.prototype.create = function() {
    // Set volume
    this.game.sound.volume = 0.01;

    // Set stage background color
    this.game.stage.backgroundColor = 0x4488cc;

    // Set up movement keys
    cursors = this.createCursorKeys();

    // Create the Tilemap
    this.createMap();

    // Create the Editor
    this.createEditor();

    // Turn on Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Game modes, woo!
    this.game.gameMode = 'shooty';

    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
    this.game.input.x = this.game.width/2;
    this.game.input.y = this.game.height/2;

    // Create a player
    this.player = new Player(this.game, this.game.width/2, this.game.height/2, cursors);
    this.game.add.existing(this.player);
    this.game.physics.enable(this.player);
    //this.game.physics.arcade.gravity.y = 250;
    this.player.body.collideWorldBounds = true;


    // Create a follower
    this.follower = new Follower(this.game, this.game.width/2, this.game.height/2, this.player)
    this.game.add.existing(this.follower);
    this.game.physics.enable(this.follower);
    this.follower.body.collideWorldBounds = true;


    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#000000' }
    );
    this.fpsText.fixedToCamera = true;
    // Show Interaction Mode
    this.modeText = this.game.add.text(
        20, 40, '', { font: '16px Arial', fill: '#000000' }
    );
    this.modeText.fixedToCamera = true;

    // Set up sfx
    this.game.sfx = game.add.audio('shoot');

    // Set up camera
    this.game.camera.follow(this.player);

};

// The update() method is called every frame
GameState.prototype.update = function() {
    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }
    this.modeText.setText('mode - ' + this.game.gameMode);

    this.game.physics.arcade.collide(this.player, this.mapLayer);
    this.game.physics.arcade.collide(this.player, this.follower);
    this.game.physics.arcade.collide(this.follower, this.mapLayer);
    this.game.physics.arcade.overlap(this.game.bulletPool, this.mapLayer, this.bulletHitWall);
    this.game.physics.arcade.overlap(this.game.bulletPool, this.follower, this.bulletHitFollower);

    this.updateEditor();
};

GameState.prototype.bulletHitWall = function(bullet, wall)
{
    // console.log(bullet);
    // console.log(wall);
    bullet.hit(wall);
}

// for some odd reason the follower is always first, even though the docs say otherwise.
// try updating phaser version?
GameState.prototype.bulletHitFollower = function(follower, bullet)
{
    // console.log(bullet);
    // console.log(follower);
    bullet.hit(follower);
}

// Set up keyboard input
GameState.prototype.createCursorKeys = function () {
    return {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        mode: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }
}
