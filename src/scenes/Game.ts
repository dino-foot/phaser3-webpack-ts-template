import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';
import PieTimer from '../helpers/PieTimer';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
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
        this.createBackground();
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'background').setOrigin(0.5).setDepth(0);
        Display.Align.In.Center(this.background, this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight));
    }
}
