import { Scene, Cameras, Display, GameObjects, Scale } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { ImageButton } from '../helpers/ImageButton';
import { EventsController } from '../controllers/eventsController';

export class Game extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    bottomPanel: GameObjects.Image;
    frame: GameObjects.Image;
    mobileLogo: GameObjects.Image;
    shieldLeft: GameObjects.Image;
    shieldRight: GameObjects.Image;
    prizePoolContainer: GameObjects.Container;
    nextRoundContainer: GameObjects.Container;
    demoVideo: GameObjects.Video;
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

        this.createBackground();
        this.createFrame();

        this.createLowerBox();
        this.embedVideo();
        this.createButtons();
        this.checkOrientation(this.scale.orientation);
    }

    private createFrame() {
        const frameKey = this.isLandscape ? 'video-frame' : 'mobile-frame';
        const offsetY = this.isLandscape ? -65 : 185;
        this.frame = this.add.image(this.camera.centerX, this.camera.centerY + offsetY, frameKey).setOrigin(0.5).setDepth(4);
    }

    private createBackground() {
        const bgSpriteKey = (this.isDeskTop || this.isLandscape) ? 'desktopBg' : 'mobileBg';
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, bgSpriteKey).setOrigin(0.5).setDepth(0);
        Display.Align.In.Center(this.background, this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight));
    }

    private createButtons() {
        const enterNowConfig = { id: 'enter-now-normal', x: 0, y: 0, depth: 4, scale: 0.125, frames: { texture: 'enter-now-normal', up: 'enter-now-normal', over: 'enter-now-overlay', down: 'enter-now-overlay' }};
        const plusBtnConfig = { id: 'plus-normal', x: 0, y: 0, depth: 4, scale: 0.25, frames: { texture: 'plus-normal', up: 'plus-normal', over: 'plus-pressed', down: 'plus-pressed' } };
        const minusBtnConfig = { id: 'minus-normal', x: 0, y: 0, depth: 4, scale: 0.25, frames: { texture: 'minus-normal', up: 'minus-normal', over: 'minus-pressed', down: 'minus-pressed' } };
        
        
        const enterNowButton = new ImageButton(this, enterNowConfig, this.handleEnterNowButton);
        const offsetY = (this.isDeskTop || this.isLandscape) ? 540 : 490;
        Phaser.Display.Align.In.BottomCenter(enterNowButton, this.background, 5, offsetY);

        const plusBtn = new ImageButton(this, plusBtnConfig, this.handlePlusButton);
        const minusBtn = new ImageButton(this, minusBtnConfig, this.handleMinusButton);

        Display.Align.In.Center(plusBtn, enterNowButton, enterNowButton.displayWidth/1.5);
        Display.Align.In.Center(minusBtn, enterNowButton, -enterNowButton.displayWidth/1.5);
    }

    private createLowerBox() {
        const prizePoolText = this.addText('99,000', 0, 10);
        const prizePool = this.add.image(0, 0, 'prize-pool').setOrigin(0.5).setDepth(2).setScale(0.15);
        this.prizePoolContainer = PhaserHelpers.createContainer(this, 300, 320, true);
        this.prizePoolContainer.setDepth(2).add([prizePool, prizePoolText]);
        Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.frame, -210, 0);

        const nextRoundText = this.addText('10,000', 0, 10);
        const nextRound = this.add.image(0, 0, 'next-round').setOrigin(0.5).setDepth(2).setScale(0.15);
        this.nextRoundContainer = PhaserHelpers.createContainer(this, 300, 320, true);
        this.nextRoundContainer.setDepth(2).add([nextRound, nextRoundText]);
        Phaser.Display.Align.In.BottomLeft(this.nextRoundContainer, this.frame, -170, 0);
    }

    private embedVideo() {
        const offsetY = this.isLandscape ? 10 : 160;
        this.demoVideo = this.add.video(this.camera.centerX, this.camera.centerY + offsetY, 'demo-video').setOrigin(0.5).setInteractive().setLoop(true).setVolume(1).setDepth(1).play(true);
        this.demoVideo.setScale(this.isLandscape ? 0.7 : 0.35);
        this.demoVideo.once('created', () => {
            const maskRect = this.add.rectangle(0, 0, this.demoVideo.displayWidth, this.demoVideo.displayHeight, 0x000000);
            Phaser.Display.Align.In.BottomCenter(maskRect, this.frame, 0, -20);
            const mask = maskRect.createGeometryMask();
            this.demoVideo.setMask(mask);
        });
    }

    checkOrientation(orientation) {
        this.isLandscape = orientation === Scale.Orientation.LANDSCAPE;

        if (this.currentOrienation !== orientation) {
            this.currentOrienation = this.scale.orientation;
            this.updateGameSize();
            this.scale.refresh();

            // redraw 
            this.cleanupLayout();
            this.cameras.main.fadeIn(800, 0, 0, 0);

            this.createBackground();
            this.createFrame();
            this.createLowerBox();
            this.embedVideo();
            this.createButtons();
        }

        if (!this.isDeskTop && this.isLandscape) {
            // console.log('landscape');
            this.prizePoolContainer.setScale(0.75);
            this.nextRoundContainer.setScale(0.75);
            Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.background, 30, -220);
            Phaser.Display.Align.In.BottomLeft(this.nextRoundContainer, this.background, 50, -220);
        } else {
            // console.log('portrait');
            this.prizePoolContainer.setScale(0.75).setDepth(4);
            this.nextRoundContainer.setScale(0.75).setDepth(4);
            Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.frame, 10, 210);
            Phaser.Display.Align.In.BottomLeft(this.nextRoundContainer, this.frame, 0, 210);
        }


        this.scale.refresh();
    }

    private cleanupLayout() {
        this.background?.destroy();
        this.frame?.destroy();
        this.prizePoolContainer?.destroy();
        this.nextRoundContainer?.destroy();
        this.demoVideo?.destroy();
    }

    onResize(gameSize, baseSize, displaySize, resolution) {
        // const width = gameSize.width;
        // const height = gameSize.height;
        // this.cameras.resize(width, height);
        // console.log('onResize', gameSize);
    }

    handleEnterNowButton() {
        console.log('enter-now');
    }

    handlePlusButton() {
        console.log('plus');
    }

    handleMinusButton() {
        console.log('minus');
    }

    private addText(text: string, x: number, y: number) {
        return this.add.text(x, y, text, {
            fontFamily: 'Roboto-Medium',
            fontSize: 50,
            color: '#ffffff',
        }).setOrigin(0.5).setDepth(2).setInteractive();
    }
}
