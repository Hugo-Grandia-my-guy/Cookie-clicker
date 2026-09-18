class factory {
    constructor(name, baseCost, baseMps) {
        this.name = name;
        this.baseCost = baseCost;
        this.baseMps = baseMps;

        this.count = 0;
        this.costMultiplier = 1.15;
    }

    get currentCost() {
        return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.count));
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

    buy(){

    }

}

let cursor = new factory("cursor", 10, 0.1);
let parkRuthe = new factory("parkRuthe", 100, 1);
let garage = new factory("garage", 5000, 50);

