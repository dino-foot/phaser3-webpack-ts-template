import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';
import PieTimer from '../helpers/PieTimer';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    isDeskTop: boolean;
    isLandscape: boolean;
    currentOrienation: Scale.Orientation;
    gamewidth: number;
    gameHeight: number;

    constructor() {
        super('Game');
    }

    init() {
        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation === Scale.Orientation.LANDSCAPE;
        this.currentOrienation = this.scale.orientation;

        this.scale.on('orientationchange', this.checkOrientation, this);
        // this.scale.on('resize', this.onResize, this);

        this.gamewidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);

        // console.log('isDesktop >> ', this.isDeskTop);
        // console.log('isLandscape >> ', this.isLandscape);

        // update game size for portrait mode
        this.updateGameSize();
    }

    private updateGameSize() {
        if (!this.isLandscape) {
            this.scale.setGameSize(720, 1600);
        }
        else {
            this.scale.setGameSize(1920, 1080);
        }
        this.scale.refresh();
    }

    create() {
        this.camera = this.cameras.main;
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'background').setOrigin(0.5).setDepth(0);
        Display.Align.In.Center(this.background, this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight));
    }

    checkOrientation(orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            this.updateGameSize();
            this.scale.refresh();

            // redraw 
            // this.cleanupLayout();
            this.cameras.main.fadeIn(800, 0, 0, 0);
        }

        this.scale.refresh();
    }

    onResize(gameSize, baseSize, displaySize, resolution) {
        // const width = gameSize.width;
        // const height = gameSize.height;
        // this.cameras.resize(width, height);
        // if (width > height) {
        //     console.log('Landscape mode');
        //     // Additional actions for landscape mode
        // } else {
        //     console.log('Portrait mode');
        //     // Additional actions for portrait mode
        // }
    }
}
