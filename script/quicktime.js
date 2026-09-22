



function startQTE() {
    const keys = ["e", "q", "f", "r"];
    const correctKey = keys[Math.floor(Math.random() * keys.length)];

    const timeLimit = 10000; // 10 seconden
    const startTime = performance.now();
    let finished = false;

    document.getElementById("qte").textContent =
        `Press ${correctKey.toUpperCase()}!`;

    function updateTimer() {
        if (finished) return;

        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, timeLimit - elapsed);

        document.getElementById("timer").textContent =
            (remaining / 1000).toFixed(2);

        if (remaining <= 0) {
            finished = true;
            document.getElementById("qte").textContent = "❌ Too slow!";
            cleanup();
            return;
        }

        requestAnimationFrame(updateTimer);
    }

    function handleKey(event) {
        if (finished) return;

        if (event.key.toLowerCase() === correctKey) {
            finished = true;
            document.getElementById("qte").textContent = "✅ Success!";
            cleanup();
        }
    }

    function cleanup() {
        document.removeEventListener("keydown", handleKey);
    }

    document.addEventListener("keydown", handleKey);

    updateTimer();
}

// Start de QTE
startQTE();

setInterval(() => {
    startQTE();
}, 15000);
