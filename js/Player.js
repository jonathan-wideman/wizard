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



Player.prototype.createBullets = function () {
    // Define constants
    this.SHOT_DELAY = 200; // milliseconds (5 bullets/second)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 20;
    this.BULLET_SPREAD = 0.1;

    // Create an object representing our gun
    this.gun = this.game.add.sprite(50, this.game.height/2, 'bullet');

    // Set the pivot point to the center of the gun
    this.gun.anchor.setTo(0.5, 0.5);

    // Make the gun invisible
    this.gun.visible = false;

    // Create an object pool of bullets
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }
}

Player.prototype.shootBullet = function() {

    if (this.game.gameMode != 'shooty') {
        return;
    }
    
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;

    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    // Revive the bullet
    // This makes the bullet "alive"
    bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.gun.x, this.gun.y);
    bullet.rotation = this.gun.rotation + (game.rnd.frac() * this.BULLET_SPREAD - this.BULLET_SPREAD / 2);

    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;

    this.game.sfx.play();
};

Player.prototype.updateBullets = function() {

	this.gun.x = this.x;
	this.gun.y = this.y;

    // Aim the gun at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);

    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
        this.shootBullet();
    }
};