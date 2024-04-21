import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    worldZone: GameObjects.Zone;
    gamewidth: number;
    gameHeight: number;

    constructor() {
        super('Game');
    }

    init() {
        this.gamewidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);
    }

    create() {
        this.camera = this.cameras.main;
        this.worldZone = this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight);
        this.createBackground();
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, `background-${Phaser.Math.Between(1, 2)}`).setOrigin(0.5).setDepth(0);
        this.background.setDisplaySize(this.camera.width, this.camera.height);
        Display.Align.In.Center(this.background, this.worldZone);
    }
}
