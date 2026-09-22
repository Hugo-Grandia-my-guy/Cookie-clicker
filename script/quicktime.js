
const timeLimit = 10000; // 10 seconds

let startTime = performance.now();
let finished = false;

function updateTimer() {
    if (finished) return;

    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, timeLimit - elapsed);

    document.getElementById("timer").textContent =
        (remaining / 1000).toFixed(2);

    if (remaining <= 0) {
        finished = true;
        document.getElementById("qte").textContent = "❌ Too slow!";
        return;
    }

    requestAnimationFrame(updateTimer);
}

document.addEventListener("keydown", function(event) {
    if (finished) return;

    if (event.key.toLowerCase() === correctKey) {
        finished = true;
        document.getElementById("qte").textContent = "✅ Success!"
    }
});

updateTimer();

const keys = ["e", "q", "f", "r"];

const correctKey = keys[Math.floor(Math.random() * keys.length)];

document.getElementById("qte").textContent =
    `Press ${correctKey.toUpperCase()}!`;

function startQTE() {
    const keys = ["e", "q", "f", "r"];
    const correctKey = keys[Math.floor(Math.random() * keys.length)];

    console.log("Press:", correctKey);

    const startTime = performance.now();
    const timeLimit = 1500;

    function handleKey(event) {
        if (event.key.toLowerCase() === correctKey) {
            console.log("SUCCESS!");
            cleanup();
        }
    }

    function checkTime() {
        if (performance.now()- startTime >= timeLimit) {
            console.log("working");
            cleanup();
        } else {
            requestAnimationFrame(checkTime);
        }
    }

    function cleanup() {
        document.removeEventListener("keydown", handleKey);
    }

    document.addEventListener("keydown", handleKey);
    requestAnimationFrame(checkTime);
}

startQTE();
