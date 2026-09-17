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

    get totalMps() {
        return this.count * this.baseMps;
    }



}

let cursor = new factory("cursor", 10, 0.1);
let parkRuthe = new factory("parkRuthe", 100, 5);
let garage = new factory("garage", 5000, 100);


// class cursor extends factory {constructor() {super("cursor", 10, 0.1);}}

/*
class parkRuthe extends factory {
    constructor(name, metersPerSec, baseCost){
        super(metersPerSec, baseCost);
        this.name = name;
    }

}

passiveIncome(){
    setInterval(function (){
        metersAmount = metersAmount + this.metersPerSec;
    }, 1000)
}*/