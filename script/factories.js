class factory {
    constructor(baseCost, metersPerSec) {
        this.baseCost = baseCost;
        this.metersPerSec = metersPerSec;
    }

    passiveIncome(){
        setInterval(function (){
            metersAmount = metersAmount + this.metersPerSec;
        }, 1000)
    }
}

class ParkRuthe extends factory {
    constructor(name, picture, metersPerSec, baseCost){
        super(metersPerSec, baseCost);
        this.name = name;
    }

}

