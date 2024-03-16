import { GameObjects, Scene } from 'phaser';
import { PhaserHelpers } from '../helpers';
import { ImageButton } from '../helpers/ImageButton';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    bottomPanel: GameObjects.Image;
    frame: Phaser.GameObjects.Image;
    shieldLeft: Phaser.GameObjects.Image;
    shieldRight: Phaser.GameObjects.Image;
    prizePoolContainer: GameObjects.Container;
    nextRoundContainer: GameObjects.Container;
    demoVideo: GameObjects.Video;
    // msg_text : Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    init() {
        // console.log(this.sys.game.device.os);
    }

    create() {
        this.camera = this.cameras.main;
        // Calculate scale factor based on aspect ratio

        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'bg-with-side-panel').setOrigin(0.5);
        this.background.setDepth(0);

        this.bottomPanel = this.add.image(0, 0, 'bottom-panel').setDepth(3);
        Phaser.Display.Align.In.BottomCenter(this.bottomPanel, this.background);

        //? overlay
        // const overlay = this.add.image(this.camera.centerX, this.camera.centerY, 'overlay').setAlpha(0.5);
        // overlay.setDepth(10);

        // background element
        this.frame = this.add.image(this.camera.centerX, this.camera.centerY - 65, 'video-frame').setDepth(4);
        this.frame.setOrigin(0.5);

        // this.shieldLeft = this.add.image(0, 0, 'shield').setOrigin(0.5).setDepth(1).setScale(0.75);
        // Phaser.Display.Align.In.LeftCenter(this.shieldLeft, this.background);

        this.createLowerBox();

        this.embedVideo();

        const enterNowConfig = { id: 'enter-now-normal', x: 0, y: 0, depth: 4, scale: 0.125, frames: { texture: 'enter-now-normal', up: 'enter-now-normal', over: 'enter-now-overlay', down: 'enter-now-overlay' }, scaleX: 0.7, scaleY: 0.7 };
        const enterNowButton = new ImageButton(this, enterNowConfig, this.handleEnterNowButton);
        enterNowButton.setOrigin(0.5);
        Phaser.Display.Align.In.BottomCenter(enterNowButton, this.background, 0, 540);

        // orientation change event 
        // EventsController.onOrientationchange(this.checkOriention, this);
        this.scale.on('orientationchange', this.checkOriention, this);
        this.checkOriention(this.scale.orientation);

        // this.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight);
        // this.scale.refresh();
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
        this.demoVideo = this.add.video(this.camera.centerX, this.camera.centerY, 'demo-video').setOrigin(0.5);
        this.demoVideo.setInteractive();
        this.demoVideo.setLoop(true);
        this.demoVideo.setVolume(1);
        this.demoVideo.setDepth(1);
        this.demoVideo.play(true);

        this.demoVideo.once('created', () => {
            //  Resize the video stream to fit our monitor once the texture has been created
            this.demoVideo.setDisplaySize(this.frame.width, this.frame.height).setVisible(true);
        });

        const maskRect = this.add.rectangle(0, 0, this.frame.width - 330, this.frame.height - 200, 0x000000);
        Phaser.Display.Align.In.BottomCenter(maskRect, this.frame, -20);
        maskRect.setVisible(true);
        const mask = maskRect.createGeometryMask();
        this.demoVideo.setMask(mask);
    }

    handleEnterNowButton() {
        console.log('enter-now');
    }

    checkOriention(orientation) {
        // console.log('changed');
        if (orientation === Phaser.Scale.PORTRAIT) {
            // todo change sprite
            console.log('portrait');
        }
        else if (orientation === Phaser.Scale.LANDSCAPE) {
            // todo change sprite
            console.log('landscape', this);

            if (this.sys.game.device.os.desktop === false) {
                // this.background.setTexture('mobile-bg')
        
                Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.background, 20, -220);
                Phaser.Display.Align.In.BottomLeft(this.nextRoundContainer, this.background, 20, -220);
            
                // this.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight);
                // this.scale.refresh();

                // this.frame.setDisplaySize(1500, this.frame.displayHeight);
                // this.demoVideo.setDisplaySize(this.frame.width, this.frame.height)
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
