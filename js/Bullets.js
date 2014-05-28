// Bullet constructor
var Bullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Enable physics on the bullet
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    this.SPEED = 250; // bullet speed pixels/second
};

// Bullets are a type of Phaser.Sprite
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
    // If this bullet is dead, don't do any of these calculations
    if (!this.alive) {
        return;
    }
};

Bullet.prototype.aim = function(origin) {
    // Set the bullet position to the origin position.
    bullet.reset(origin.x, origin.y);

    // Aim the bullet at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    bullet.rotation = this.game.physics.arcade.angleToPointer(bullet) + (game.rnd.frac() * this.BULLET_SPREAD - this.BULLET_SPREAD / 2);
}

Bullet.prototype.shoot = function() {
    
}

Player.prototype.createBullets = function () {
    // Define constants
    this.SHOT_DELAY = 200; // milliseconds (5 bullets/second)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 20;
    this.BULLET_SPREAD = 0.1;

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

    // Set the bullet position to the player position.
    bullet.reset(this.x, this.y);

    // Aim the bullet at the pointer.
    // All this function does is calculate the angle using
    // Math.atan2(yPointer-yGun, xPointer-xGun)
    bullet.rotation = this.game.physics.arcade.angleToPointer(bullet) + (game.rnd.frac() * this.BULLET_SPREAD - this.BULLET_SPREAD / 2);

    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;

    this.game.sfx.play();
};

Player.prototype.updateBullets = function() {
    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
        this.shootBullet();
    }
};








