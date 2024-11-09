import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';
import { Deck } from '../helpers';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    table: GameObjects.Image;
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

        this.add.text(10, 20, `Phaser v${Phaser.VERSION}`);
        const deck = new Deck(this);
        deck.stackDeck(300, 300);
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'background').setOrigin(0.5).setDepth(0);
        Display.Align.In.Center(this.background, this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight));

        const dealer = this.add.image(this.camera.centerX, this.camera.centerY - 300, 'dealer').setOrigin(0.5).setDepth(1);
        dealer.setScale(0.60);

        this.table = this.add.image(this.camera.centerX, this.camera.centerY + 200, 'table').setOrigin(0.5).setDepth(2);
        this.table.setScale(0.75);
    }
}

// https://phaser.io/sandbox/MCrRX8zp

