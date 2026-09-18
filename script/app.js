class player{
    constructor(){
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
        this.factories = [cursor, parkRuthe, garage];
        this.lastUpdate = Date.now();
    }

    get totalMps() {
        return this.factories.reduce((sum, factory) => sum + factory.totalMps, 0);
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

        this.updateFactoryUI('cursorCounter', 'buyCursorButton', cursor);
        this.updateFactoryUI('parkRutheCounter', 'buyParkRutheButton', parkRuthe);
        this.updateFactoryUI('garageCounter', 'buyGarageButton', garage);
    }

    updateFactoryUI(counterId, buttonId, factoryInstance) {
        const counterElem = document.getElementById(counterId);
        const buttonElem = document.getElementById(buttonId);

        if (counterElem) {
            counterElem.innerText = `${factoryInstance.name}: ${factoryInstance.count}`;
        }
        if (buttonElem) {
            const cost = factoryInstance.currentCost;
            buttonElem.innerText = `Koop ${factoryInstance.name} (${cost} m)`;
            buttonElem.disabled = this.player.meters < cost;
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

        const purchases = [
            { id: 'buyCursorButton', instance: cursor },
            { id: 'buyParkRutheButton', instance: parkRuthe },
            { id: 'buyGarageButton', instance: garage }
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

    start() {
        this.setupEventListeners();
        const TICK_RATE = 100; // Updates DOM 10 times per second for smooth updates
        this.lastUpdate = Date.now();
        setInterval(() => this.update(), TICK_RATE);
    }
}

const game = new Game();
game.start();