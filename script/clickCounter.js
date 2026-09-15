let metersAmount = 0;
let metersPerClick = 1;

document.getElementById('Bike').addEventListener("click", clickCounter)

function clickCounter() {
    document.getElementById('meterCounter').innerText = metersAmount + metersPerClick;
}