class player {
    constructor() {
        this.meters = 1000;
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

        this.factories = [
            cursor,
            parkRuthe,
            garage,
            eBike
        ];
        this.lastUpdate = Date.now();
        this.currentMultiplier = '1';
    }

    get totalMps() {
        return this.factories.reduce((sum, factory) => sum + factory.totalMps, 0);
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


        // Here also new factory must be added         !!!

        this.updateFactoryUI('cursorCounter', 'buyCursorButton', cursor);
        this.updateFactoryUI('parkRutheCounter', 'buyParkRutheButton', parkRuthe);
        this.updateFactoryUI('garageCounter', 'buyGarageButton', garage);
        this.updateFactoryUI('eBikeCounter', 'buyEBikeButton', eBike);
    }


    updateFactoryUI(counterId, buttonId, factoryInstance) {
        const counterElem = document.getElementById(counterId);
        const buttonElem = document.getElementById(buttonId);

        if (counterElem) {
            counterElem.innerText = `${factoryInstance.name}: ${factoryInstance.count}`;
        }

        if (buttonElem) {
            const { amountToBuy, cost } = this.getBuyAmountAndCost(factoryInstance);

            if (this.currentMultiplier === '1') {
                buttonElem.innerText = `Buy x1 (${cost} m)`;
            } else {
                buttonElem.innerText = `Buy x${amountToBuy} (${cost} m)`;
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

        const multButtons = document.querySelectorAll('.multBtn');
        multButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                multButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMultiplier = e.target.getAttribute('data-mult');
                this.render();
            });
        });


        // And here new factory too                 !!!

        const purchases = [
            { id: 'buyCursorButton', instance: cursor },
            { id: 'buyParkRutheButton', instance: parkRuthe },
            { id: 'buyGarageButton', instance: garage },
            { id: 'buyEBikeButton', instance: eBike }
        ];

        purchases.forEach(({ id, instance }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    const { amountToBuy } = this.getBuyAmountAndCost(instance);
                    if (amountToBuy > 0) {
                        instance.buy(this.player, amountToBuy);
                        this.render();
                    }
                });
            }
        });
    }

    start() {
        this.setupEventListeners();
        const TICK_RATE = 200;
        this.lastUpdate = Date.now();
        setInterval(() => this.update(), TICK_RATE);
    }
}

const game = new Game();
game.start();