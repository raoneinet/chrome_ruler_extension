chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message === "check_status"){
        sendResponse({active: true});
        return true;
    }

    if(message === "enable_ruler"){
        enableRuler();
        sendResponse({success: true});
        return true
    }

    if(message === "disable_ruler"){
        disableRuler();
        sendResponse({success: true});
        return true;
    }
})

let isEnabled = false;
let overlay = null;
let label = null;
let startX = 0;
let startY = 0;
let lastW = 0;
let lastH = 0;
let rem = 0;
let mouseDown = false;
let confirmCopy = false;
let isDragging = false;

function createOverlay() {
    overlay = document.createElement("div");
    overlay.id = "__pixel_ruler_overlay";
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999999;
    `;
    document.body.appendChild(overlay);
}

function removeOverlay() {
    overlay?.remove();
    overlay = null;
}

function enableRuler() {
    if (isEnabled) return;
    isEnabled = true;

    getRemfromBrowser();
    createOverlay();

    document.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onStop);

    document.body.style.userSelect = "none";
}

function disableRuler() {
    isEnabled = false;

    document.removeEventListener("mousedown", onStart);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onStop);

    removeOverlay();

    document.body.style.userSelect = "";
}

function onStart(e) {
    mouseDown = true;
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
}

function getRemfromBrowser() {
    const rootFont = window.getComputedStyle(document.documentElement).fontSize;

    if (rootFont) {
        rem = parseFloat(rootFont);
    }
}

function createMessagePopup(pixelMsg) {
    const toast = document.createElement("div");
    toast.textContent = pixelMsg;

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(1, 1, 107, 0.8);
        color: #fff;
        padding: 8px 12px;
        margin: 0;
        font-size: 13px;
        border-radius: 6px;
        z-index: 999999999;
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 1500);
}

function confirmCopyResult() {
    return new Promise((resolve) => {
        const confirmDiv = document.createElement("div");
        const p = document.createElement("p");
        const yesDiv = document.createElement("button");
        const noDiv = document.createElement("button");

        p.textContent = "Copy?";
        yesDiv.textContent = "Y";
        noDiv.textContent = "N";

        let resolved = false;

        function safeResolve(value) {
            if (!resolved) {
                resolved = true;
                resolve(value);
            }
        }

        yesDiv.addEventListener("click", () => {
            confirmDiv.remove();
            safeResolve(true);
        });

        noDiv.addEventListener("click", () => {
            confirmDiv.remove();
            safeResolve(false);
        });

        yesDiv.style.cssText = `
            background-color: #fff;
            color: #000;
            border-radius: 4px;
        `;

        noDiv.style.cssText = `
            background-color: #fff;
            color: #000;
            border-radius: 4px;
        `;

        confirmDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(1, 1, 107, 0.8);
            color: #fff;
            padding: 8px 12px;
            margin: 0;
            font-size: 13px;
            border-radius: 6px;
            z-index: 999999999;
            opacity: 0;
            transition: opacity 0.25s ease;
            display: flex;
            flex-direction: column;
            gap: 3px;
        `;

        confirmDiv.append(p, yesDiv, noDiv);

        document.body.append(confirmDiv);

        requestAnimationFrame(() => {
            confirmDiv.style.opacity = "1";
        });

        setTimeout(() => {
            confirmDiv.style.opacity = "0";
            setTimeout(() => {
                confirmDiv.remove();
                safeResolve(false);
            }, 800);
        }, 2500);
    });
}

function copyPixelResult() {
    if (lastW === 0 && lastH === 0) return;

    const pixels = `w: ${lastW}px | h: ${lastH}px`;
    navigator.clipboard.writeText(pixels)
        .then(() => {
            createMessagePopup(`Copiado: ${pixels}`);
        });
}

function onMove(e) {
    if (!mouseDown || !overlay) return;

    if (!isDragging) {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
    }

    lastW = Math.abs(e.clientX - startX);
    lastH = Math.abs(e.clientY - startY);
    const remW = Math.abs(lastW / rem);
    const remY = Math.abs(lastH / rem);

    overlay.innerHTML = `
        <div style="
            position: fixed;
            left: ${Math.min(e.clientX, startX)}px;
            top: ${Math.min(e.clientY, startY)}px;
            width: ${lastW}px;
            height: ${lastH}px;
            border: 1px dashed #00f;
            background-color: rgba(0,0,255,0.1);
            pointer-events: none;
        "></div>
        <div style="
            position: fixed;
            left: ${e.clientX + 10}px;
            top: ${e.clientY + 10}px;
            background-color: black;
            color: white;
            padding: 4px 5px;
            font-size: 12px;
            border-radius: 4px;
            pointer-events: none;
        ">
            <div>w: ${lastW}px × h: ${lastH}px<div>
            <div style="font-size: 10px;">
                ${remW.toFixed(2)}rem x ${remY.toFixed(2)}rem
            </div>
        </div>
    `;
}

async function onStop() {
    mouseDown = false;

    if (!isDragging) return;
    isDragging = false;

    if (overlay) overlay.innerHTML = "";

    const userChoice = await confirmCopyResult();
    if (userChoice) {
        copyPixelResult();
    } else {
        return;
    }

}

// Recebe comando do popup
// chrome.runtime.onMessage.addListener((msg) => {
//     if (msg === "enable_ruler") enableRuler();
//     if (msg === "disable_ruler") disableRuler();
// });
