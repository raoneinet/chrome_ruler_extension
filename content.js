let isEnabled = false;
let overlay = null;
let label = null;
let startX = 0;
let startY = 0;
let rem = 0;
let mouseDown = false;

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
    startX = e.clientX;
    startY = e.clientY;
}

function getRemfromBrowser() {
    const rootFont = window.getComputedStyle(document.documentElement).fontSize;

    if (rootFont) {
        rem = parseFloat(rootFont)
    }
}

function onMove(e) {
    if (!mouseDown || !overlay) return;

    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    const remW = Math.abs(w / rem);
    const remY = Math.abs(h / rem);

    overlay.innerHTML = `
        <div style="
            position: fixed;
            left: ${Math.min(e.clientX, startX)}px;
            top: ${Math.min(e.clientY, startY)}px;
            width: ${w}px;
            height: ${h}px;
            border: 1px dashed #00f;
            background: rgba(0,0,255,0.1);
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
            <div>w: ${w}px × h: ${h}px<div>
            <div style="font-size: 10px;">
                ${remW.toFixed(2)}rem x ${remY.toFixed(2)}rem
            </div>
        </div>
    `;
}

function onStop() {
    mouseDown = false;
    if (overlay) overlay.innerHTML = "";
}

// Recebe comando do popup
chrome.runtime.onMessage.addListener((msg) => {
    if (msg === "enable_ruler") enableRuler();
    if (msg === "disable_ruler") disableRuler();
});
