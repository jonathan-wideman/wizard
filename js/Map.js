GameState.prototype.createMap = function() {

	//  The 'mario' key here is the Loader key given in game.load.tilemap
	this.map = game.add.tilemap('map');

	//  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    this.map.addTilesetImage('Desert', 'tiles');
    
    // Set collision hopefully for the rock tile
    this.map.setCollision(32);

    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    this.mapLayer = this.map.createLayer('Ground');

    //  Un-comment this on to see the collision tiles
    //this.mapLayer.debug = true;

    //  This resizes the game world to match the layer dimensions
    this.mapLayer.resizeWorld();

}