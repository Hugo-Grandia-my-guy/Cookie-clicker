let metersAmount = 0;
let metersPerClick = 1;

document.getElementById('Bike').addEventListener("click", clickCounter)

function clickCounter() {
    metersAmount = metersAmount + metersPerClick;
    document.getElementById('meterCounter').innerText = metersAmount;
}

const buyMarkRutteButton = document.getElementById("buyMarkRutteButton");

let MarkRutte =0;
let MarkRuttePrijs = 10



buyMarkRutteButton.addEventListener("click",function () {
    if (metersAmount >= MarkRutte) {
        metersAmount = metersAmount - MarkRuttePrijs;
        MarkRutte = MarkRutte + 4;
    }
});
