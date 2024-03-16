import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.load.on('complete', () => { this.scene.start('Game') }, this);
        this.addLoadingBar();
    }

    addLoadingBar() {
        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'logo');
        logo.setOrigin(0.5);

        const { width } = this.cameras.main;
        const { height } = this.cameras.main;

        const progressBar = this.add.graphics();
        progressBar.fillStyle(0xEEEEEE, 0.5);
        progressBar.fillRect(width / 2 - 200, height / 2, 400, 15);

        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x4CCD99, 1);
        progressBox.fillRect(width / 2 - 200, height / 2, 400, 15);

        const text = this.make.text({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY + 50,
            text: "Loading...",
            style: {
                fontSize: "24px",
                fontFamily: "Roboto-Black",
                color: "white",
            },
        }).setOrigin(0.5);

        this.load.on('progress',
            (value: any) => {
                // console.log('loading ... ', value);
                text.setText(`Loading ... ${Math.round(value * 100)}%`);
                progressBox.clear();
                progressBox.fillStyle(0x4CCD99, 1);
                progressBox.fillRect(width / 2 - 200, height / 2, 400 * value, 15);
            },
            this,
        );
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('background', 'bg.png');
        this.load.image('bg-with-side-panel', 'bg-with-side-panel.png');
        this.load.image('mobile-frame', 'mobile-frame.png');
        this.load.image('video-frame', 'frame.png');
        this.load.image('overlay', 'overlay.png');
        this.load.image('bottom-panel', 'bottom-panel.png');
        this.load.image('shield', 'shield.png');

        this.load.image('next-round', 'others/next-round.png');
        this.load.image('prize-pool', 'others/prize-pool.png');
        this.load.image('enter-now-normal', 'others/enter-now-normal.png');
        this.load.image('enter-now-overlay', 'others/enter-now-overlay.png');

        // load demo video
        this.load.video('demo-video', 'videos/demo-video.mp4', true);
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start('MainMenu');
    }
}
