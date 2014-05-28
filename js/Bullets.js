// Bullet constructor
var Bullet = function(game, x, y)
{
    Phaser.Sprite.call(this, game, x, y, 'bullet');

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Enable physics on the bullet
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Set its initial state to "dead".
    this.kill();

    // Define constants that affect motion
    this.SPEED = 500; // bullet speed pixels/second
    this.SPREAD = 0.1;

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

// Bullets are a type of Phaser.Sprite
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function ()
{
    /*
    if (!this.alive) {
        return;
    }
    */
}

Bullet.prototype.aim = function(origin)
{
    // Set the bullet position to the origin position.
    this.reset(origin.x, origin.y);

    // Aim the bullet at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    this.rotation = this.game.physics.arcade.angleToPointer(this) + (game.rnd.frac() * this.SPREAD - this.SPREAD / 2);
}

Bullet.prototype.shoot = function()
{
    // Shoot it in the right direction
    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

    // Pew pew!
    this.game.sfx.play();
}

Bullet.prototype.hit = function(target)
{
    this.game.state.getCurrentState().getExplosion(this.x, this.y);
    //console.log(this.game.state.getCurrentState())
    this.kill();
}



Player.prototype.createBullets = function ()
{
    // Define constants
    this.SHOT_DELAY = 200; // milliseconds (5 bullets/second)
    this.NUMBER_OF_BULLETS = 20;

    // Create an object pool of bullets
    this.game.bulletPool = this.game.add.group();
    //this.game.physics.enable(this.game.bulletPool, Phaser.Physics.ARCADE);
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        //var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.game.bulletPool.add(new Bullet(this.game));
    }

    // Create a group for explosions
    this.game.state.getCurrentState().explosionGroup = this.game.add.group();
}

Player.prototype.shootBullet = function()
{
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
    var bullet = this.game.bulletPool.getFirstDead();

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) {
        return;
    }

    // Revive the bullet
    // This makes the bullet "alive"
    bullet.revive();

    // Ready, aim, fire
    bullet.aim(this);
    bullet.shoot();
};

Player.prototype.updateBullets = function()
{
    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
        this.shootBullet();
    }
};

// Try to get a used explosion from the explosionGroup.
// If an explosion isn't available, create a new one and add it to the group.
// Setup new explosions so that they animate and kill themselves when the
// animation is complete.
GameState.prototype.getExplosion = function(x, y)
{
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom');
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};




