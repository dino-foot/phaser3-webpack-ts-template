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

        // this.load.image('background', 'bg.png');

        this.load.image("logo", "blackjack/phaser-large.png");
        this.load.image("spade", "blackjack/spade.png");
        this.load.image("club", "blackjack/club.png");
        this.load.image("heart", "blackjack/heart.png");
        this.load.image("diamond", "blackjack/diamond.png");
        this.load.image("card_bg", "blackjack/card_bg.png");
        this.load.image("card_front", "blackjack/card_front.png");
        this.load.image("background", "blackjack/bg.png");
        this.load.image("table", "blackjack/table.png");
    }

    create() { }
}
