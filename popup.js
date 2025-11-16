let active = false;

const activateBtn = document.getElementById("activate")
const deactivateBtn = document.getElementById("deactivate")

activateBtn.addEventListener("click", () => {
    active = true;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "enable_ruler"
        );
    });

    if (active === true) {
        if (!activateBtn.classList.contains("active")) {
            activateBtn.classList.add("active")
        }
    }
});

deactivateBtn.addEventListener("click", () => {
    active = false;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "disable_ruler"
        )
    })

    if (active === false) {
        deactivateBtn.classList.remove("active")
    }
});
