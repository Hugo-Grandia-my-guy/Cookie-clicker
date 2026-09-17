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
    if (metersAmount >= ParkRuthe) {
        metersAmount = metersAmount - ParkRuthePrijs;
        ParkRuthe = metersPerClick + 4;
    }
});
