// Deck module for creating and handling a deck of cards
export class Deck {
    scene: any;
    cards: any[];
    depth: number;

    constructor(scene) {
        this.scene = scene;
        this.cards = this.createDeck();
        this.depth = 1;
        Phaser.Utils.Array.Shuffle(this.cards);
    }

    createDeck() {
        const suits = ["Spades", "Clubs", "Hearts", "Diamonds"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        let deck = [];

        suits.forEach((suit) => {
            ranks.forEach((rank) => {
                let icon = "";
                switch (suit) {
                    case "Spades":
                        icon = "spade";
                        break;
                    case "Clubs":
                        icon = "club";
                        break;
                    case "Hearts":
                        icon = "heart";
                        break;
                    case "Diamonds":
                        icon = "diamond";
                        break;
                }
                deck.push({ rank, suit, icon });
            });
        });

        return deck;
    }

    stackDeck(x, y) {
        const offset = -0.15; // Small offset for stacking effect

        // Loop through each card in reverse order to set the last card on top
        this.cards
            .slice()
            .reverse()
            .forEach((card, index) => {
                // Create a container to hold the card elements
                const cardContainer = this.scene.add.container(x + offset * index, y + offset * index);

                // Create card front and back images
                const cardFront = this.scene.add.image(0, 0, "card_front").setDisplaySize(70, 95);
                const cardBack = this.scene.add.image(0, 0, "card_bg").setDisplaySize(70, 95).setVisible(false); // Start with the back hidden

                // Add rank text and suit icon to the back of the card
                const rankText = this.scene.add.text(-25, -40, card.rank, { fontSize: "26px", color: "#000000" }).setVisible(false);
                const suitIcon = this.scene.add.image(10, 20, card.icon).setDisplaySize(30, 30).setVisible(false);
                const suitIconSmall = this.scene.add.image(-15, -10, card.icon).setDisplaySize(14, 14).setVisible(false);

                // Add all elements to the container
                cardContainer.add([cardFront, cardBack, rankText, suitIcon, suitIconSmall]);

                // Set depth based on reversed index so the last card has the highest depth
                cardContainer.setDepth(this.cards.length - index);

                // Make the front image interactive and add click-to-flip functionality
                cardFront.setInteractive().on("pointerdown", () => {
                    this.flipCard(cardContainer, cardFront, cardBack, rankText, suitIcon, suitIconSmall, x + offset * index, y + offset * index);
                });
            });
    }


    flipCard(cardContainer, cardFront, cardBack, rankText, suitIcon, suitIconSmall, x, y) {
        // First, tween to move the card to a new position
        this.depth += 1;
        cardContainer.setDepth(this.depth);

        this.scene.tweens.add({
            targets: cardContainer,
            x: x + 150,
            y: y + 50,
            duration: 300,
            onComplete: () => {
                // Then, tween for the flip effect by shrinking horizontally
                this.scene.tweens.add({
                    targets: cardContainer,
                    scaleX: 0, // Shrink for the flip effect
                    duration: 150,
                    onComplete: () => {
                        // Toggle visibility to flip from front to back
                        cardFront.setVisible(false);
                        cardBack.setVisible(true);
                        rankText.setVisible(true);
                        suitIcon.setVisible(true);
                        suitIconSmall.setVisible(true);

                        // Complete the flip by scaling back to normal
                        this.scene.tweens.add({
                            targets: cardContainer,
                            scaleX: 1,
                            duration: 150,
                            onComplete: () => {
                                // cardContainer.setDepth(depth )
                                console.log('depth :: ', cardContainer.depth);
                            }
                        });
                    },
                });
            },
        });
    }
}