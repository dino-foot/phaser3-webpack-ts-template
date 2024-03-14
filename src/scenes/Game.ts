import { GameObjects, Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    bottomPanel: GameObjects.Image;
    frame: Phaser.GameObjects.Image;
    prizePoolContainer: GameObjects.Container;
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

        const prizePool = this.add.image(0, 0, 'prize-pool').setOrigin(1).setDepth(2).setScale(0.15);
        Phaser.Display.Align.In.BottomCenter(prizePool, this.frame, -330, -25);

        this.demoVideo = this.add.video(this.camera.centerX, this.camera.centerY, 'demo-video').setOrigin(0.5);
        this.demoVideo.setDepth(1);

        this.demoVideo.once('created', () => {
            //  Resize the video stream to fit our monitor once the texture has been created
            this.demoVideo.setDisplaySize(this.frame.width, this.frame.height).setVisible(true);
        });
        this.demoVideo.play(true);

        const maskRect = this.add.rectangle(0, 0, this.frame.width - 330, this.frame.height - 200, 0x000000);
        Phaser.Display.Align.In.BottomCenter(maskRect, this.frame, -20);
        maskRect.setVisible(true);
        const mask = maskRect.createGeometryMask();
        this.demoVideo.setMask(mask);
        
    }
}
