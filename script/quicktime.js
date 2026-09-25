



function startQTE() {
    const keys = ["f", "i", "e", "t", "s"];
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
            document.getElementById("qte").textContent = "🦽 Too slow!";
            cleanup();
            return;
        }

        requestAnimationFrame(updateTimer);
    }

    function handleKey(event) {
        if (finished) return;

        if (event.key.toLowerCase() === correctKey) {
            finished = true;

            const elapsed = performance.now() - startTime;
            const seconds = elapsed / 1000;

            const qte = document.getElementById("qte");

            if (seconds < 0.25) {
                qte.textContent = "👑 INSANE!";
            } else if (seconds < 0.5) {
                qte.textContent = "🐐 GOAT!";
            } else if (seconds < 1) {
                qte.textContent = "🔥 PERFECT!";
            } else if (seconds < 2) {
                qte.textContent = "⚡ FAST!";
            } else if (seconds < 3.2) {
                qte.textContent = "🐰 Rabbit!";
            } else if (seconds < 3.3) {
                qte.textContent = "6️7";
            } else if (seconds < 7) {
                qte.textContent = "👍 SUCCESS!";
            } else if (seconds < 9) {
                qte.textContent = "😘 Holy moly!";
            } else {
                qte.textContent = "😅 BARELY!";
            }

            cleanup();
        }
    }


    function cleanup() {
        document.removeEventListener("keydown", handleKey);
    }

    document.addEventListener("keydown", handleKey);

    updateTimer();
}

startQTE()
function randomQTE() {
    const delay = Math.floor(Math.random() * (210000 - 150000 + 1)) + 150000;

    setTimeout(() => {
        startQTE();
        randomQTE();
    }, delay);
}


// Start de QTE
randomQTE();
