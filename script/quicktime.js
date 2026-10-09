let buffTimeout = null;

function applyBuff(multiplier, durationSeconds) {
    game.player.buffMultiplier = multiplier;
    const notice = document.getElementById("buffNotice");

    if (notice) {
        notice.textContent = `⚡ BOOST Active: x${multiplier} (${durationSeconds}s)`;
    }

    if (buffTimeout) clearTimeout(buffTimeout);

    buffTimeout = setTimeout(() => {
        game.player.buffMultiplier = 1;
        if (notice) notice.textContent = "";
    }, durationSeconds * 1000);
}

function startQTE() {
    const keys = ["f", "i", "e", "t", "s"];
    const correctKey = keys[Math.floor(Math.random() * keys.length)];

    const timeLimit = 5000; // 5 sec for reaction
    const startTime = performance.now();
    let finished = false;

    // creating QTE
    const qteElem = document.createElement("div");
    qteElem.className = "qte-popup";
    qteElem.innerHTML = `
        <div id="qte">Press ${correctKey.toUpperCase()}!</div>
        <div class="qte-progress-bar">
            <div class="qte-progress-fill" id="qteFill"></div>
        </div>
    `;

    // random QTE position
    const padding = 100;
    const randomX = Math.random() * (window.innerWidth - padding * 2) + padding;
    const randomY = Math.random() * (window.innerHeight - padding * 2) + padding;

    qteElem.style.left = `${randomX}px`;
    qteElem.style.top = `${randomY}px`;

    document.body.appendChild(qteElem);

    const fillElem = qteElem.querySelector("#qteFill");

    function updateTimer() {
        if (finished) return;

        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, timeLimit - elapsed);
        const percent = (remaining / timeLimit) * 100;

        if (fillElem) fillElem.style.width = `${percent}%`;

        if (remaining <= 0) {
            finished = true;
            cleanup(" Too slow!");
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

            let buffMult = 2;
            let duration = 10;

            if (seconds < 0.5) {
                buffMult = 5; // x5 buff for perfect reaction
                duration = 15;
            } else if (seconds < 1.5) {
                buffMult = 3;
                duration = 12;
            }

            applyBuff(buffMult, duration);
            cleanup(` SUCCESS! x${buffMult} Boost!`);
        }
    }

    function cleanup(message) {
        document.removeEventListener("keydown", handleKey);
        if (qteElem.parentNode) {
            qteElem.querySelector("#qte").textContent = message;
            setTimeout(() => {
                if (qteElem.parentNode) qteElem.remove();
            }, 800);
        }
    }

    document.addEventListener("keydown", handleKey);
    updateTimer();
}

function randomQTE() {
    // Random interval from 20 to 45 sec
    const delay = Math.floor(Math.random() * 25000) + 20000;

    setTimeout(() => {
        startQTE();
        randomQTE();
    }, delay);
}

// first QTE start after 10 sec
setTimeout(randomQTE, 10000);