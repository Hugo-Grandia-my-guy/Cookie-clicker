class player{
    constructor(){
        this.meters = 10000;
        this.metersPerClick = 1;
    }

    clickCounter() {
        return this.meters += this.metersPerClick;
    }
}

class Game {
    constructor() {
        this.player = new player();
        this.factories = [
            cursor,
            parkRuthe,
            garage,
            eBike
        ];
        this.lastUpdate = Date.now();
        this.currentMultiplier = 1;
    }

    get totalMps() {
        return this.factories.reduce((sum, factory) => sum + factory.totalMps, 0);
    }

    get buyAmountAndCost(factoryInstance){
        let amount = 0;
        if(this.currentMultiplier === 'max') {
            amount = factoryInstance.getMaxAffordable(this.player.meters);
            if(amount === 0) {
                return {
                    amountToBuy: 0,
                    cost: factoryInstance.currentCost,
                    nextUnitCost: factoryInstance.currentCost
                }
            }
        }
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
        if (meterElem) meterElem.innerText = Math.floor(this.player.meters);

        const mpsElem = document.getElementById('mpsCounter');
        if (mpsElem) mpsElem.innerText = this.totalMps.toFixed(1);

        //                             ↓↓↓ Set here new factories ↓↓↓

        this.updateFactoryUI('cursorCounter', 'buyCursorButton', cursor);
        this.updateFactoryUI('parkRutheCounter', 'buyParkRutheButton', parkRuthe);
        this.updateFactoryUI('garageCounter', 'buyGarageButton', garage);
        this.updateFactoryUI('eBikeCounter', 'buyEBikeButton', eBike);
    }

    setupEventListeners() {
        const bikeBtn = document.getElementById('bikeButton');
        if (bikeBtn) {
            bikeBtn.addEventListener('click', () => {
                this.player.clickCounter();
                this.render();
            });
        }

        //      ↓↓↓ And also here ↓↓↓

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
                    instance.buy(this.player, 1);
                    this.render();
                });
            }
        });
    }

    updateFactoryUI(counterId, buttonId, factoryInstance) {
        const counterElem = document.getElementById(counterId);
        const buttonElem = document.getElementById(buttonId);

        if (counterElem) {
            counterElem.innerText = `${factoryInstance.name}: ${factoryInstance.count}`;
        }
        if (buttonElem) {
            const cost = factoryInstance.currentCost;
            buttonElem.innerText = `Buy ${factoryInstance.name} (${cost} m)`;
            buttonElem.disabled = this.player.meters < cost;
        }
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