let active = false;

const activateBtn = document.getElementById("activate")
const deactivateBtn = document.getElementById("deactivate")

activateBtn.addEventListener("click", () => {
    active = true;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const url = tabs[0].url

        if(!url.startsWith("http")){
            console.log("It's not possible to run the Ruler in this url")
            return
        }

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
            },
            () => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    "enable_ruler",
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.log("Content script  is not available")
                        }
                    }
                );
            }
        )
    });

    activateBtn.classList.add("active");
});

deactivateBtn.addEventListener("click", () => {
    active = false;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "disable_ruler"
        )
    })
    activateBtn.classList.remove("active");
});
