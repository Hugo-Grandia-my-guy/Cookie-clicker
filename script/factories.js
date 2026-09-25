
// FACTORIES

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


// UPGRADES

class cursorUpgrade extends factory {
    constructor(name, baseCost, obtained = false) {

        super(name, baseCost, 0);

        this.obtained = obtained;

    }

    buy(player, amount = 1) {
        if (this.obtained) return false;
        const success = super.buy(player, 1);

        if (success) {
            this.obtained = true;
            player.metersPerClick *= 2;
            return true;
        }
        return false;
    }
}

//      Add here a new Factories, also DON'T FORGET to add it in app.js    !!!
//       1.   this.factories [...]
//       2.   in render(){...} and
//       3.   in setupEventListener(){...}

const cursor = new factory("👈Cursor", 5, 1);
const parkRuthe = new factory("🚴‍♀️Park Ruthe", 100, 10);
const garage = new factory("🔳Garage", 5000, 250);
const eBike = new factory("🔋e-Bike", 100000, 5000);

// Add here new upgrades

const cursorUpgrade0 = new cursorUpgrade("cursorUpgrade0", 100, false);
const cursorUpgrade1 = new cursorUpgrade("cursorUpgrade1", 1000, false);
const cursorUpgrade2 = new cursorUpgrade("cursorUpgrade2", 10000, false);
const cursorUpgrade3 = new cursorUpgrade("cursorUpgrade3", 100000, false);

