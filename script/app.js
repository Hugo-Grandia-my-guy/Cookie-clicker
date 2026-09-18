class player{
    constructor(meters){
        this.meters = meters;
    }

    clickCounter() {
        this.meters = metersAmount + metersPerClick;
        document.getElementById('meterCounter').innerText = metersAmount;
    }
}

class Game{
    constructor() {
        this.player = new player();

        this.lastUpdate = Date.now();
    }

    get totalMps() {
        return this.factory.reduce((sum, factory) => sum + factory.totalMps, 0);
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Meters based on time difference
        const metersGained = this.totalMps * deltaTime;
        this.player.meters += metersGained;

        this.render();
    }

    render() {
        console.clear();
        console.log(`--- BICYCLE CLICKER ---`);
        console.log(`Meters: ${Math.floor(this.player.meters)}`);
        console.log(`Income (MPS): ${this.totalMps.toFixed(1)}/sec`);
        console.log(`----------------------`);
        console.log(`Available factories:`);
        this.factory.forEach(b => {
            console.log(` - ${b.name}: ${b.count} (CPS: ${b.totalMps.toFixed(1)})`);
        });
    }

    start() {
        // App tick every 0.5 sec
        const TICK_RATE = 500;

        this.lastUpdate = Date.now();
        setInterval(() => this.update(), TICK_RATE);
    }
}