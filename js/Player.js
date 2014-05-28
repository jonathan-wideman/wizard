// Player constructor
var Player = function(game, x, y, cursors) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    // Save the cursors that this Player will obey
    this.cursors = cursors;

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

   	// Set facing for the sprite
   	this.facing = 'south';
   	this.state = 'idle';

   	// Add animations
   	this.animations.add('walk-west', [3, 4, 5], 10, true);
   	this.animations.add('walk-east', [6, 7, 8], 10, true);
   	this.animations.add('walk-north', [9, 10, 11], 10, true);
   	this.animations.add('walk-south', [0, 1, 2], 10, true);
   	this.animations.add('idle-west', [4], 1, false);
   	this.animations.add('idle-east', [7], 1, false);
   	this.animations.add('idle-north', [10], 1, false);
   	this.animations.add('idle-south', [1], 1, false);

    // Enable physics on this object
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    //this.MAX_SPEED = 250; // pixels/second
    this.MIN_DISTANCE = 32; // pixels
    this.WALK_SPEED = 3; // pixels
    
    // Define movement constants
    this.MAX_SPEED = 200; // pixels/second
    this.ACCELERATION = 1600; // pixels/second/second
    this.DRAG = 1600; // pixels/second
    
    // Set player maximum movement speed
    this.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.body.drag.setTo(this.DRAG, this.DRAG); // x, y

    // Create a pool of Bullets
    this.createBullets();
};

// Players are a type of Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    this.handleInput();
    this.updateBullets();
};

Player.prototype.handleInput = function () {
    //this.body.velocity.x = 0;
    //this.body.velocity.y = 0;
    walked = false;

    if (this.cursors.left.isDown) {
        //this.x -= this.WALK_SPEED;
        this.body.acceleration.x = -this.ACCELERATION;
        this.facing = 'west';
        walked = true;
    } else if (this.cursors.right.isDown) {
        //this.x += this.WALK_SPEED;
        this.body.acceleration.x = this.ACCELERATION;
        this.facing = 'east';
        walked = true;
    } else {
    	this.body.acceleration.x = 0;
    }

    if (this.cursors.up.isDown) {
        //this.y -= this.WALK_SPEED;
        this.body.acceleration.y = -this.ACCELERATION;
        this.facing = 'north';
        walked = true;
    } else if (this.cursors.down.isDown) {
        //this.y += this.WALK_SPEED;
        this.body.acceleration.y = this.ACCELERATION;
        this.facing = 'south';
        walked = true;
    } else {
    	this.body.acceleration.y = 0;
    }

    // Switch Modes
    if (this.cursors.mode.justPressed(10)) {
        if (this.game.gameMode == 'editoration') {
            this.game.gameMode = 'shooty';
        } else {
            this.game.gameMode = 'editoration';
        }
    } 

    // Do Animations
    if (walked) {
    	this.state = 'walk';
    } else {
    	this.state = 'idle';
    }
    this.animations.play(this.state + '-' + this.facing);
}