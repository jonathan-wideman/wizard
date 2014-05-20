GameState.prototype.createEditor = function() {

	this.editorCurrentTile = this.map.getTile(1, 1);

	this.editorMarker = game.add.graphics();
    this.editorMarker.lineStyle(2, 0x000000, 1);
    this.editorMarker.drawRect(0, 0, 32, 32);

}

GameState.prototype.updateEditor = function() {
	if (this.game.gameMode != 'editoration') {
		this.editorMarker.visible = false;
		return;
	} else {
		this.editorMarker.visible = true;
		this.editorMarker.x = this.mapLayer.getTileX(game.input.activePointer.worldX) * 32;
	    this.editorMarker.y = this.mapLayer.getTileY(game.input.activePointer.worldY) * 32;
	}

	this.updateEditorInput();
}

GameState.prototype.updateEditorInput = function() {
	if (this.game.gameMode != 'editoration') {
		return;
	}

	if (this.game.input.mousePointer.isDown)
    {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            this.editorPickTile();
        } else {
        	this.editorPaintTile();
        }
    }
}

GameState.prototype.editorPaintTile = function() {
	if (this.map.getTile(this.mapLayer.getTileX(this.editorMarker.x), this.mapLayer.getTileY(this.editorMarker.y)) != this.editorCurrentTile) {
        this.map.putTile(this.editorCurrentTile, this.mapLayer.getTileX(this.editorMarker.x), this.mapLayer.getTileY(this.editorMarker.y))
    }
}

GameState.prototype.editorPickTile = function() {
	this.editorCurrentTile = this.map.getTile(this.mapLayer.getTileX(this.editorMarker.x), this.mapLayer.getTileY(this.editorMarker.y));
}