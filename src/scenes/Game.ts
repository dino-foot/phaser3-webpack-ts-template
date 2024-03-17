import { Display, GameObjects, Scene } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { ImageButton } from '../helpers/ImageButton';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    bottomPanel: GameObjects.Image;
    frame: GameObjects.Image;
    mobileLogo: GameObjects.Image;
    shieldLeft: Phaser.GameObjects.Image;
    shieldRight: Phaser.GameObjects.Image;
    prizePoolContainer: GameObjects.Container;
    nextRoundContainer: GameObjects.Container;
    demoVideo: GameObjects.Video;
    isDeskTop: boolean;
    isLandscape: boolean;

    gamewidth: number;
    gameHeight: number;

    constructor() {
        super('Game');
    }

    init() {
        this.isDeskTop = this.sys.game.device.os.desktop;
        this.isLandscape = this.scale.orientation.toString() === Phaser.Scale.LANDSCAPE ? true : false;
        this.scale.on('orientationchange', this.checkOriention, this);

        this.gamewidth = Number(this.game.config.width);
        this.gameHeight = Number(this.game.config.height);

        console.log('isDesktop >> ', this.isDeskTop);
        console.log('isLandscape >> ', this.isLandscape);
    }

    create() {
        this.camera = this.cameras.main;

        if (!this.isLandscape) {
            this.scale.setGameSize(720, 1600);
            // this.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight);
            this.scale.refresh();
        }

        const bgSpriteKey = (this.isDeskTop || this.isLandscape) ? 'desktopBg' : 'mobileBg';
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, bgSpriteKey).setOrigin(0.5);
        this.background.setDepth(0);
        Display.Align.In.Center(this.background, this.add.zone(this.camera.centerX, this.camera.centerY, this.gamewidth, this.gameHeight));

        const frameKey = this.isLandscape ? 'video-frame' : 'mobile-frame';
        const offsetY = this.isLandscape ? -65 : 185;
        this.frame = this.add.image(this.camera.centerX, this.camera.centerY + offsetY, frameKey).setDepth(4);
        this.frame.setOrigin(0.5);


        this.createLowerBox();
        this.embedVideo();
        this.createButtons();

        // this.checkOriention(this.scale.orientation);

        // if (!this.isDeskTop) {
        //     if (this.isLandscape) {
        //         this.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight);
        //         this.scale.refresh();
        //     }
        // }

    }

    private createButtons() {
        const enterNowConfig = { id: 'enter-now-normal', x: 0, y: 0, depth: 4, scale: 0.125, frames: { texture: 'enter-now-normal', up: 'enter-now-normal', over: 'enter-now-overlay', down: 'enter-now-overlay' }, scaleX: 0.7, scaleY: 0.7 };
        const enterNowButton = new ImageButton(this, enterNowConfig, this.handleEnterNowButton);
        enterNowButton.setOrigin(0.5);
        Phaser.Display.Align.In.BottomCenter(enterNowButton, this.background, 5, 490);
    }

    private createLowerBox() {
        let text;
        text = PhaserHelpers.addText(this.getTextSettings('99,000', 0, 10), this);
        const prizePool = this.add.image(0, 0, 'prize-pool').setOrigin(0.5).setDepth(2).setScale(0.15);
        this.prizePoolContainer = PhaserHelpers.createContainer(this, 300, 320, true);
        this.prizePoolContainer.setDepth(2);
        this.prizePoolContainer.add(prizePool);
        this.prizePoolContainer.add(text);
        Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.frame, -210, 0);

        text = PhaserHelpers.addText(this.getTextSettings('10,000', 0, 10), this);
        const nextRound = this.add.image(0, 0, 'next-round').setOrigin(0.5).setDepth(2).setScale(0.15);
        this.nextRoundContainer = PhaserHelpers.createContainer(this, 300, 320, true);
        this.nextRoundContainer.setDepth(2);
        this.nextRoundContainer.add(nextRound);
        this.nextRoundContainer.add(text);
        Phaser.Display.Align.In.BottomLeft(this.nextRoundContainer, this.frame, -170, 0);
    }

    private embedVideo() {
        const offsetY = this.isLandscape ? 10 : 160;
        this.demoVideo = this.add.video(this.camera.centerX, this.camera.centerY + offsetY, 'demo-video').setOrigin(0.5);
        this.demoVideo.setInteractive();
        this.demoVideo.setLoop(true);
        this.demoVideo.setVolume(1);
        this.demoVideo.setDepth(1);
        this.demoVideo.play(true);
        this.demoVideo.setScale(this.isLandscape ? 0.7 : 0.35);

        // this.demoVideo.once('created', () => {
        //     console.log(this.demoVideo.displayWidth)
        //     const maskRect = this.add.rectangle(0, 0, this.demoVideo.displayWidth, this.demoVideo.displayHeight, 0x000000);
        //     Phaser.Display.Align.In.BottomCenter(maskRect, this.frame, 0, -20);
        //     // maskRect.setVisible(true);
        //     const mask = maskRect.createGeometryMask();
        //     this.demoVideo.setMask(mask);
        // });

        // // const offsetX = (!this.isDeskTop && this.isLandscape === true) ? 330 : 330;
    }

    handleEnterNowButton() {
        console.log('enter-now');
    }

    checkOriention(orientation) {
        this.isLandscape = orientation === Phaser.Scale.LANDSCAPE;

        if (!this.isDeskTop) {
            if (this.isLandscape) {
                // this.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight);
                // this.scale.refresh();

                // this.frame.setDisplaySize(1500, this.frame.displayHeight);
                // this.demoVideo.setDisplaySize(this.frame.displayWidth, this.frame.displayHeight);
                // console.log(this.frame.displayWidth / this.frame.displayHeight);

                this.prizePoolContainer.setScale(0.75);
                this.nextRoundContainer.setScale(0.75);
                Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.background, 30, -220);
                Phaser.Display.Align.In.BottomLeft(this.nextRoundContainer, this.background, 50, -220);
                console.log('orientation changed');

            }
            else {
                this.background.setTexture('mobileBg');
            }
        }
    }

    private getTextSettings(text, x, y) {
        return {
            text: text,
            x: x,
            y: y,
            origin: {
                x: 0.5,
                y: 0.5,
            },
            style: {
                fontFamily: 'Roboto-Medium',
                fontSize: 50,
                color: '#ffffff',
                // backgroundColor: '#ff00ff',
            },
            depth: 2,
            isInterActive: true,
        };
    };
}
