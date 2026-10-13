class player {
    constructor() {
        this.meters = 0;
        this.metersPerClick = 1;
        this.buffMultiplier = 1;
    }

    clickCounter() {
        return this.meters += (this.metersPerClick * this.buffMultiplier);
    }
}

class Game {
    constructor() {
        this.player = new player();
        this.purchases = purchases; // Geïmporteerd uit factories.js
        this.lastUpdate = Date.now();
        this.currentMultiplier = '1';
    }

    initUI() {
        const upgradesWindow = document.getElementById('upgradesList');
        const factoriesWindow = document.getElementById('factoriesList');

        upgradesWindow.innerHTML = '';
        factoriesWindow.innerHTML = '';

        this.purchases.forEach(item => {
            const itemHTML = `
                <div class="upgrade-item">
                    <span id="${item.id}Counter">${item.name}: 0</span>
                    <button id="buy${item.id.charAt(0).toUpperCase() + item.id.slice(1)}Button" class="upgradeBtn">${item.name}</button>
                </div>
            `;

            if (item.type === 'factory') {
                factoriesWindow.innerHTML += itemHTML;
            } else {
                upgradesWindow.innerHTML += itemHTML;
            }
        });
    }

    updateTheme() {
        const meters = this.player.meters;
        const body = document.body;
        body.classList.remove('theme-green', 'theme-blue', 'theme-purple', 'theme-orange', 'theme-gold');

        if (meters >= 100000000) body.classList.add('theme-gold');
        else if (meters >= 1000000) body.classList.add('theme-orange');
        else if (meters >= 50000) body.classList.add('theme-purple');
        else if (meters >= 10000) body.classList.add('theme-blue');
        else body.classList.add('theme-green');
    }

    updateMultiplierUI() {
        const multButtons = document.querySelectorAll('.multBtn');
        multButtons.forEach(btn => {
            if (btn.getAttribute('data-mult') === this.currentMultiplier) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    render() {
        const meterElem = document.getElementById('meterCounter');
        if (meterElem) meterElem.innerText = Formatter.format(this.player.meters, 'm');

        const mpsElem = document.getElementById('mpsCounter');
        if (mpsElem) mpsElem.innerText = Formatter.format(this.totalMps * this.player.buffMultiplier);

        const mpcElem = document.getElementById('mpcCounter');
        if (mpcElem) mpcElem.innerText = Formatter.format(this.player.metersPerClick * this.player.buffMultiplier);

        // Dynamisch alle items updaten via de array!
        this.purchases.forEach(item => {
            const counterElem = document.getElementById(`${item.id}Counter`);
            const buttonElem = document.getElementById(`buy${item.id.charAt(0).toUpperCase() + item.id.slice(1)}Button`);

            if (counterElem) {
                counterElem.innerText = `${item.name}: ${Formatter.format(item.count)}`;
            }

            if (buttonElem) {
                const { amountToBuy, cost } = this.getBuyAmountAndCost(item);
                const formattedCost = Formatter.format(cost, 'm');

                if (this.currentMultiplier === '1') {
                    buttonElem.innerText = `Buy x1 (${formattedCost})`;
                } else {
                    buttonElem.innerText = `Buy x${amountToBuy} (${formattedCost})`;
                }

                buttonElem.disabled = this.player.meters < cost || amountToBuy === 0;
            }
        });

        this.updateTheme();
    }

    get totalMps() {
        return this.purchases.reduce((sum, item) => sum + item.totalMps, 0);
    }

    getBuyAmountAndCost(itemInstance) {
        let amount = 0;
        if (this.currentMultiplier === 'max') {
            amount = itemInstance.getMaxAffordable(this.player.meters);
            if (amount === 0) {
                return { amountToBuy: 0, cost: itemInstance.currentCost, nextUnitCost: itemInstance.currentCost };
            }
        } else {
            amount = parseInt(this.currentMultiplier, 10);
        }

        const cost = itemInstance.getCostFor(amount);
        return { amountToBuy: amount, cost: cost, nextUnitCost: itemInstance.currentCost };
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        const metersGained = (this.totalMps * this.player.buffMultiplier) * deltaTime;
        this.player.meters += metersGained;

        this.render();
    }

    setupEventListeners() {
        const bikeBtn = document.getElementById('bikeButton');
        if (bikeBtn) {
            bikeBtn.addEventListener('click', () => {
                this.player.clickCounter();
                this.render();
            });
        }

        const resetButton = document.getElementById("resetGameButton");
        if (resetButton) {
            resetButton.addEventListener("click", () => this.resetGame());
        }

        const multButtons = document.querySelectorAll('.multBtn');
        multButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                multButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMultiplier = e.target.getAttribute('data-mult');
                this.render();
            });
        });

        // Automatische event listeners koppelen op basis van de array!
        this.purchases.forEach(item => {
            const btnId = `buy${item.id.charAt(0).toUpperCase() + item.id.slice(1)}Button`;
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    const { amountToBuy } = this.getBuyAmountAndCost(item);
                    if (amountToBuy > 0) {
                        item.buy(this.player, amountToBuy);
                        this.render();
                    }
                });
            }
        });
    }

    start() {
        this.initUI(); // Genereer eerst de HTML elementen dynamisch
        this.loadGame();
        this.setupEventListeners();

        const TICK_RATE = 100;
        this.lastUpdate = Date.now();

        setInterval(() => this.update(), TICK_RATE);
        setInterval(() => this.saveGame(), 1000);
    }

    saveGame() {
        const saveData = {
            player: {
                meters: this.player.meters,
                metersPerClick: this.player.metersPerClick
            },
            counts: {},
            currentMultiplier: this.currentMultiplier
        };

        // Slaat automatisch alle counts op via de ID's
        this.purchases.forEach(item => {
            saveData.counts[item.id] = item.count;
        });

        localStorage.setItem("walkingGameSave", JSON.stringify(saveData));
    }

    loadGame() {
        const savedGame = localStorage.getItem("walkingGameSave");
        if (!savedGame) return;

        const saveData = JSON.parse(savedGame);
        this.player.meters = saveData.player.meters;
        this.player.metersPerClick = saveData.player.metersPerClick;

        if (saveData.counts) {
            this.purchases.forEach(item => {
                if (saveData.counts[item.id] !== undefined) {
                    item.count = saveData.counts[item.id];
                }
            });
        }

        this.currentMultiplier = saveData.currentMultiplier || '1';
        this.updateMultiplierUI();
        this.render();
    }

    resetGame() {
        if (!confirm("Weet je zeker dat je alle voortgang wilt verwijderen?")) return;

        localStorage.removeItem("walkingGameSave");
        this.player.meters = 0;
        this.player.metersPerClick = 1;

        this.purchases.forEach(item => {
            item.count = 0;
        });

        this.currentMultiplier = "1";
        this.updateMultiplierUI();
        this.render();
    }
}

const game = new Game();
game.start();