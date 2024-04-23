import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { vector2 } from '../types';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    worldZone: GameObjects.Zone;
    gamewidth: number;
    gameHeight: number;
    pinsCategory: number;
    coinsCategory: number;
    bucketCategory: number;

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

        this.pinsCategory = this.matter.world.nextCategory();
        this.coinsCategory = this.matter.world.nextCategory();
        this.bucketCategory = this.matter.world.nextCategory();

        this.createBackground();
        this.createPins();
        this.handleInput();
    }

    private createBackground() {
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, `background-${Phaser.Math.Between(1, 2)}`).setOrigin(0.5).setDepth(0);
        this.background.setDisplaySize(this.camera.width, this.camera.height);
        Display.Align.In.Center(this.background, this.worldZone);
    }

    private createPins() {
        const startY = 280;
        const startX = 10;
        const rows = 13;
        const columns = 11;
        const horizontalSpacing = 90;
        const verticalSpacing = 95;
        const offsetX = 50;
        const offsetY = 50;
        const rowOffsetX = 50; // Offset for zigzag pattern

        // Loop through rows and columns to create obstacles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Calculate position based on row and column
                let x;
                if (row % 2 === 0) {
                    x = offsetX + col * horizontalSpacing;
                } else {
                    x = offsetX + col * horizontalSpacing + rowOffsetX;
                }
                const y = offsetY + row * verticalSpacing;

                // Create obstacle and add to scene
                const pin = this.add.circle(x + startX, y + startY, 15, 0xff6699).setOrigin(0.5);
                pin.setDepth(1);
                pin.setStrokeStyle(3, 0xefc53f);

                const matterPin = this.matter.add.gameObject(pin, {
                    isStatic: true,
                    label: "pin",
                    shape: "circle",
                    circleRadius: 15,
                    frictionStatic: 0,
                });
                matterPin.body.gameObject.setCollisionCategory(this.pinsCategory);
            }
        }
    }

    private handleInput() {
        const coinIndicator = this.add.image(0, 0, "coin").setScale(0.5).setDepth(2);
        coinIndicator.setVisible(false);

        const rect = PhaserHelpers.addRectangle({ x: 0, y: 0, width: this.camera.width - 50, height: 100, depth: 2, color: 0xffffff }, this, true);
        rect.setInteractive();
        rect.setAlpha(0.1);
        Display.Align.In.TopCenter(rect, this.worldZone, 0, -150);

        rect.on("pointerdown", (pointer) => {
            this.dropNewCoin({ x: pointer.x, y: rect.y + 20 });
        });

        rect.on("pointermove", (pointer, localX, localY, event) => {
            // console.log('pointerover');
            const posX = Phaser.Math.Snap.To(pointer.x, 25);
            const posY = rect.y + 20;

            coinIndicator.setVisible(true);
            coinIndicator.setPosition(posX, posY);
        });

        rect.on("pointerout", (pointer) => {
            coinIndicator.setVisible(false);
        });
    }

    private dropNewCoin(pos: vector2) {
        const coin = this.matter.add.image(pos.x, pos.y, "coin", null, {
            label: "coin",
            shape: "circle",
            circleRadius: 45,
        }).setScale(0.5).setDepth(2);

        coin.setFriction(0.005);
        coin.setBounce(1);
        coin.setCollisionCategory(this.coinsCategory);
        coin.setCollidesWith([this.coinsCategory, this.pinsCategory, this.bucketCategory]);
        // this.coins.add(coin);

        // update ui
        // this.totalCoins -= 1;
        // this.updateUI();

        // // Register collision event between coin and bucket
        // this.handleCoinVsBucketCollision();
    }
}
