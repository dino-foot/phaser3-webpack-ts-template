import { GameObjects, Scene } from 'phaser';
import { PhaserHelpers } from '../helpers';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    bottomPanel: GameObjects.Image;
    frame: Phaser.GameObjects.Image;
    prizePoolContainer: GameObjects.Container;
    nextRoundContainer: GameObjects.Container;
    demoVideo : GameObjects.Video;
    // msg_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.background = this.add.image(this.camera.centerX, this.camera.centerY, 'bg-with-side-panel');
        this.background.setOrigin(0.5);

        this.bottomPanel = this.add.image(0, 0, 'bottom-panel').setDepth(3);
        Phaser.Display.Align.In.BottomCenter(this.bottomPanel, this.background);

        // const overlay = this.add.image(this.camera.centerX, this.camera.centerY, 'overlay').setAlpha(0.5);
        // overlay.setDepth(10);

        this.frame = this.add.image(this.camera.centerX, this.camera.centerY - 65, 'video-frame').setDepth(4);
        this.frame.setOrigin(0.5);

        this.createLowerBox();
        
        this.embedVideo();
    }

    private createLowerBox() {
        const prizePool = this.add.image(0, 0, 'prize-pool').setOrigin(0.5).setDepth(2).setScale(0.15);
        this.prizePoolContainer = PhaserHelpers.createContainer(this, 300, 320, true);
        this.prizePoolContainer.setDepth(2);
        this.prizePoolContainer.add(prizePool);
        Phaser.Display.Align.In.BottomRight(this.prizePoolContainer, this.frame, -210, 0);

        const nextRound = this.add.image(0, 0, 'next-round').setOrigin(0.5).setDepth(2).setScale(0.15);
        this.nextRoundContainer = PhaserHelpers.createContainer(this, 300, 320, true);
        this.nextRoundContainer.setDepth(2);
        this.nextRoundContainer.add(nextRound);
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
}
