class player {
    constructor() {
        this.meters = 0;
        this.metersPerClick = 1;
    }

    clickCounter() {
        return this.meters += this.metersPerClick;

    }
}

class Game {
    constructor() {
        this.player = new player();
        // Add here new factory          !!!

        this.purchases = [
            //Factories
            cursor,
            parkRuthe,
            garage,
            eBike,

            //Upgrades
            clickUpgrade,
            cursorUpgrade,

        ];


        this.lastUpdate = Date.now();
        this.currentMultiplier = '1';
    }
        updateTheme() {
            const meters = this.player.meters;
            const body = document.body;

            // alle thema's


            if (meters >= 50000) {
                body.classList.add('theme-gold');
            } else if (meters >= 25000) {
                body.classList.add('theme-orange');
            } else if (meters >= 10000) {
                body.classList.add('theme-red');
            } else if (meters >= 5000) {
                body.classList.add('theme-purple');
            } else if (meters < 100) {
                body.classList.add('theme-green');
            } else {
                body.classList.add('theme-blue');
            }
        }
    render() {
        const meterElem = document.getElementById('meterCounter');

        if (meterElem) {
            if (this.player.meters >= 1000) {
                meterElem.innerText = (this.player.meters / 1000).toFixed(2) + ' km';
            } else {
                meterElem.innerText = Math.floor(this.player.meters) + ' m';
            }
        }

        const mpsElem = document.getElementById('mpsCounter');
        if (mpsElem) mpsElem.innerText = this.totalMps.toFixed(1);

        const mpcElem = document.getElementById('mpcCounter');
        if (mpcElem) mpcElem.innerText = this.player.metersPerClick.toFixed(1);


        // Here also new factory must be added         !!!

        //factories
        this.updateFactoryUI('cursorCounter', 'buyCursorButton', cursor);
        this.updateFactoryUI('parkRutheCounter', 'buyParkRutheButton', parkRuthe);
        this.updateFactoryUI('garageCounter', 'buyGarageButton', garage);
        this.updateFactoryUI('eBikeCounter', 'buyEBikeButton', eBike);

        //upgrades
        this.updateFactoryUI('clickUpgradeCounter', 'buyClickUpgradeButton', clickUpgrade);
        this.updateFactoryUI('cursorUpgradeCounter', 'buyCursorUpgradeButton', cursorUpgrade);
        this.updateFactoryUI('parkRutheUpgradeCounter', 'buyParkRutheUpgradeButton', parkRutheUpgrade);
        this.updateFactoryUI('garageUpgradeCounter', 'buyGarageUpgradeButton', garageUpgrade);
        this.updateFactoryUI('eBikeUpgradeCounter', 'buyEBikeUpgradeButton', eBikeUpgrade);

        this.updateTheme();
    }

    get totalMps() {
        return this.purchases.reduce((sum, factory) => sum + factory.totalMps, 0);
    }

    getBuyAmountAndCost(factoryInstance) {
        let amount = 0;

        if (this.currentMultiplier === 'max') {
            amount = factoryInstance.getMaxAffordable(this.player.meters);
            if (amount === 0) {
                return {
                    amountToBuy: 0,
                    cost: factoryInstance.currentCost,
                    nextUnitCost: factoryInstance.currentCost
                };
            }
        } else {
            amount = parseInt(this.currentMultiplier, 10);
        }

        const cost = factoryInstance.getCostFor(amount);
        const nextUnitCost = factoryInstance.currentCost;

        return { amountToBuy: amount, cost: cost, nextUnitCost: nextUnitCost };
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        const metersGained = this.totalMps * deltaTime;
        this.player.meters += metersGained;

        this.render();
    }




    updateFactoryUI(counterId, buttonId, factoryInstance) {
        const counterElem = document.getElementById(counterId);
        const buttonElem = document.getElementById(buttonId);

        if (counterElem) {
            counterElem.innerText = `${factoryInstance.name}: ${factoryInstance.count}`;
        }

        if (buttonElem) {
            const { amountToBuy, cost } = this.getBuyAmountAndCost(factoryInstance);
            //km check
            const formattedCost = cost >= 1000
                ? (cost / 1000).toFixed(2) + ' km'
                : cost + ' m';

            if (this.currentMultiplier === '1') {
                buttonElem.innerText = `Buy x1 (${formattedCost})`;
            } else {
                buttonElem.innerText = `Buy x${amountToBuy} (${formattedCost})`;
            }

            buttonElem.disabled = this.player.meters < cost || amountToBuy === 0;
        }
    }

    setupEventListeners() {
        const bikeBtn = document.getElementById('bikeButton');

        if (bikeBtn) {
            bikeBtn.addEventListener('click', () => {
                this.player.clickCounter();
                this.render();
            });
        }

        // RESET KNOP
        const resetButton = document.getElementById("resetGameButton");

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                this.resetGame();
            });
        }

        // MULTIPLIER BUTTONS
        const multButtons = document.querySelectorAll('.multBtn');

        multButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                multButtons.forEach(b => b.classList.remove('active'));

                e.target.classList.add('active');

                this.currentMultiplier =
                    e.target.getAttribute('data-mult');

                this.render();
            });
        });

        // PURCHASES
        const purchases = [
            // factories
            { id: 'buyCursorButton', instance: cursor },
            { id: 'buyParkRutheButton', instance: parkRuthe },
            { id: 'buyGarageButton', instance: garage },
            { id: 'buyEBikeButton', instance: eBike },

            // upgrades
            { id: 'buyClickUpgradeButton', instance: clickUpgrade },
            { id: 'buyCursorUpgradeButton', instance: cursorUpgrade },
            { id: 'buyParkRutheUpgradeButton', instance: parkRutheUpgrade },
            { id: 'buyGarageUpgradeButton', instance: garageUpgrade },
            { id: 'buyEBikeUpgradeButton', instance: eBikeUpgrade }
        ];

        purchases.forEach(({ id, instance }) => {
            const btn = document.getElementById(id);

            if (btn) {
                btn.addEventListener('click', () => {
                    const { amountToBuy } =
                        this.getBuyAmountAndCost(instance);

                    if (amountToBuy > 0) {
                        instance.buy(this.player, amountToBuy);
                        this.render();
                    }
                });
            }
        });
    }

    start() {
        this.loadGame();
        this.setupEventListeners();

        const TICK_RATE = 200;
        this.lastUpdate = Date.now();

        setInterval(() => this.update(), TICK_RATE);

        // Iedere seconde opslaan
        setInterval(() => this.saveGame(), 1000);
    }

    //opslaan van game//
    saveGame() {
        const saveData = {
            player: {
                meters: this.player.meters,
                metersPerClick: this.player.metersPerClick
            },

            factories: {
                cursor: cursor.count,
                parkRuthe: parkRuthe.count,
                garage: garage.count,
                eBike: eBike.count
            },

            upgrades: {
                clickUpgrade: clickUpgrade.count,
                cursorUpgrade: cursorUpgrade.count,
                parkRutheUpgrade: parkRutheUpgrade.count,
                garageUpgrade: garageUpgrade.count,
                eBikeUpgrade: eBikeUpgrade.count
            },

            currentMultiplier: this.currentMultiplier
        };

        localStorage.setItem("walkingGameSave", JSON.stringify(saveData));
    }
    //load
    loadGame() {
        const savedGame = localStorage.getItem("walkingGameSave");

        // Als er nog geen save bestaat
        if (!savedGame) {
            return;
        }

        const saveData = JSON.parse(savedGame);

        // Player herstellen
        this.player.meters = saveData.player.meters;
        this.player.metersPerClick = saveData.player.metersPerClick;

        // Factories herstellen
        cursor.count = saveData.factories.cursor;
        parkRuthe.count = saveData.factories.parkRuthe;
        garage.count = saveData.factories.garage;
        eBike.count = saveData.factories.eBike;

        // Upgrades herstellen
        clickUpgrade.count = saveData.upgrades.clickUpgrade;
        cursorUpgrade.count = saveData.upgrades.cursorUpgrade;
        parkRutheUpgrade.count = saveData.upgrades.parkRutheUpgrade;
        garageUpgrade.count = saveData.upgrades.garageUpgrade;
        eBikeUpgrade.count = saveData.upgrades.eBikeUpgrade;

        // Multiplier herstellen
        this.currentMultiplier = saveData.currentMultiplier || '1';

        this.render();
    }
    // set game to begin//
    resetGame() {
        const confirmed = confirm(
            "Weet je zeker dat je alle voortgang wilt verwijderen?"
        );

        if (!confirmed) {
            return;
        }

        // Save verwijderen
        localStorage.removeItem("walkingGameSave");

        // Player resetten
        this.player.meters = 0;
        this.player.metersPerClick = 1;

        // Factories resetten
        cursor.count = 0;
        parkRuthe.count = 0;
        garage.count = 0;
        eBike.count = 0;

        // Upgrades resetten
        clickUpgrade.count = 0;
        cursorUpgrade.count = 0;
        parkRutheUpgrade.count = 0;
        garageUpgrade.count = 0;
        eBikeUpgrade.count = 0;

        // Multiplier resetten
        this.currentMultiplier = "1";

        // Scherm vernieuwen
        this.render();
    }



}

const game = new Game();
game.start();