let metersAmount = 0;
let metersPerClick = 1;

document.getElementById('bikeButton').addEventListener("click", clickCounter)

function clickCounter() {
    metersAmount = metersAmount + metersPerClick;
    document.getElementById('meterCounter').innerText = metersAmount;
}

const buyParkRutheButton = document.getElementById("buyParkRutheButton");

let ParkRuthe =0;
let ParkRuthePrijs = 10



buyParkRutheButton.addEventListener("click",function () {
    if (metersAmount >= ParkRuthePrijs) {
        metersAmount = metersAmount - ParkRuthePrijs;
        ParkRuthe = metersPerClick + 4;

    }
});


const buyParisButton = document.getElementById("buyParisButton");

let Paris =0;
let ParisPrijs = 10



buyParisButton.addEventListener("click",function () {
    if (metersAmount >= ParisPrijs) {
        metersAmount = metersAmount - ParisPrijs;
        Paris = metersPerClick + 4;
    }
});


const buyGarageButton = document.getElementById("buyGarageButton");

let Garage =0;
let GaragePrijs = 10



buyGarageButton.addEventListener("click", function () {
    if (metersAmount >= GaragePrijs) {
        metersAmount = metersAmount - GaragePrijs;
        Garage = metersAmount + 4;
        document.getElementById('meterCounter').innerText = metersAmount;
    }
});

setInterval(function () {
    metersAmount = metersAmount + ParkRuthe + Paris + Garage;
    document.getElementById('meterCounter').innerText = metersAmount;
}, 1000);

