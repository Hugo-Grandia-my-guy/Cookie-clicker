class factory {
    constructor(name, baseCost, baseMps) {
        this.name = name;
        this.baseCost = baseCost;
        this.baseMps = baseMps;
        this.count = 0;
        this.costMultiplier = 1.15;
    }

    get currentCost() {
        return this.getCostFor(1);
    }

    getCostFor(amount) {
        if (amount <= 0) return 0;
        const firstCost = this.baseCost * Math.pow(this.costMultiplier, this.count);
        const totalCost = firstCost * (Math.pow(this.costMultiplier, amount) - 1) / (this.costMultiplier - 1);
        return Math.floor(totalCost);
    }

    getMaxAffordable(meters) {
        const q = this.costMultiplier;
        const b1 = this.baseCost * Math.pow(q, this.count);
        if (meters < b1) return 0;
        const n = Math.log((meters * (q - 1) / b1) + 1) / Math.log(q);
        return Math.floor(n);

    }

    get totalMps() {
        return this.count * this.baseMps;
    }

    buy(player, amount = 1) {
        const cost = this.getCostFor(amount);
        if (player.meters >= cost && amount > 0) {
            player.meters -= cost;
            this.count += amount;
            return true;
        }
        return false;
    }
}

//      Add here a new Factories, also DON'T FORGET to add it in app.js
//          in render() and
//          in setupEventListener() methods

const cursor = new factory("👈Cursor", 10, 0.5);
const parkRuthe = new factory("🚴‍♀️Park Ruthe", 100, 5);
const garage = new factory("🔳Garage", 5000, 50);
const eBike = new factory("🔋e-Bike", 100000, 500);