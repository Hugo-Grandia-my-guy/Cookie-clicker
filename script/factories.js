// FACTORIES

class factory {
    constructor(name, baseCost, baseMps) {
        this.name = name;
        this.baseCost = baseCost;
        this.baseMps = baseMps;
        this.count = 0;
        this.costMultiplier = 1.15;
    }
    //cost van factory
    get currentCost() {
        return this.getCostFor(1);
    }

    getCostFor(amount) {
        if (amount <= 0) return 0;
        const firstCost = this.baseCost * Math.pow(this.costMultiplier, this.count);
        const totalCost = firstCost * (Math.pow(this.costMultiplier, amount) - 1) / (this.costMultiplier - 1);
        return Math.floor(totalCost);
    }
 // geeft aan als je button maximaal klikt en berekent de kosten nu//
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
    //kijkt of je kan kopen//
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

//inheritance
class factoryUpgrade extends factory {
    constructor(name, baseCost) {
        super(name, baseCost, 0);

        this.costMultiplier = 5;
    }

    buy(player, amount = 1) {
        const success = super.buy(player, amount);

        if (success) {
            for (let i = 0; i < amount; i++) {
                cursor.baseMps *= 2;
            }
            return true;
        }

        return false;
    }

}

class PurchasableItem {
    constructor(id, name, baseCost, baseMps, type, target = null) {
        this.id = id;                 // Unieke sleutel voor opslag/DOM
        this.name = name;             // Weergavenaam
        this.baseCost = baseCost;
        this.baseMps = baseMps;
        this.count = 0;
        this.type = type;             // 'factory', 'clickUpgrade', of 'factoryUpgrade'
        this.target = target;         // Welke factory dit upgrade beïnvloedt
        this.costMultiplier = (type === 'factory') ? 1.15 : 5;
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
        return (this.type === 'factory') ? this.count * this.baseMps : 0;
    }

    buy(player, amount = 1) {
        const cost = this.getCostFor(amount);
        if (player.meters >= cost && amount > 0) {
            player.meters -= cost;
            this.count += amount;

            for (let i = 0; i < amount; i++) {
                if (this.type === 'clickUpgrade') {
                    player.metersPerClick *= 2;
                } else if (this.type === 'factoryUpgrade' && this.target) {
                    this.target.baseMps *= 2;
                }
            }
            return true;
        }
        return false;
    }
}


// ==========================================
// HIER VOEG JE IN DE TOEKOMST NIEUWE ITEMS TOE
// ==========================================

const cursor = new PurchasableItem('cursor', '👈Cursor', 5, 1, 'factory');
const parkRuthe = new PurchasableItem('parkRuthe', '🚴‍♀️Park Ruthe', 100, 10, 'factory');
const garage = new PurchasableItem('garage', '🔳Garage', 5000, 250, 'factory');
const eBike = new PurchasableItem('eBike', '🔋e-Bike', 100000, 5000, 'factory');
const fietsMaker = new PurchasableItem('fietsMaker', '🧑‍🔧Fiets Maker', 1000000, 10000, 'factory');

const clickUpgrade = new PurchasableItem('clickUpgrade', 'Click Upgrade', 10, 0, 'clickUpgrade');
const cursorUpgrade = new PurchasableItem('cursorUpgrade', 'Cursor Upgrade', 100, 0, 'factoryUpgrade', cursor);
const parkRutheUpgrade = new PurchasableItem('parkRutheUpgrade', 'Park Ruthe Upgrade', 1000, 0, 'factoryUpgrade', parkRuthe);
const garageUpgrade = new PurchasableItem('garageUpgrade', 'Garage Upgrade', 50000, 0, 'factoryUpgrade', garage);
const eBikeUpgrade = new PurchasableItem('eBikeUpgrade', 'e-Bike Upgrade', 1000000, 0, 'factoryUpgrade', eBike);
const fietsMakerUpgrade = new PurchasableItem('fietsMakerUpgrade', 'Fiets maker Upgrade', 10000000, 0, 'factoryUpgrade', fietsMaker);

// Centrale lijst die automatisch overal doorheen loopt
const purchases = [
    cursor, parkRuthe, garage, eBike, fietsMaker,

    clickUpgrade, cursorUpgrade, parkRutheUpgrade, garageUpgrade, eBikeUpgrade,fietsMakerUpgrade,
];