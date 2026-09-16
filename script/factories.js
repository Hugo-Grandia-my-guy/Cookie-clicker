class factory {
    constructor(cost, metersPerSecond) {
        this.cost = cost;
        this.metersPerSecond = metersPerSecond;
    }

    passiveIncome(){
        setInterval(function (){
            metersAmount = metersAmount + this.metersPerSecond;
        }, 1000)
    }
}

class rarkMuthe extends factory {
    constructor(name, picture, metersPerSecond, cost){
        super(metersPerSecond, cost);
        this.name = name;
    }

}

