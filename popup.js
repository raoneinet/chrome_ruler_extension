
const activateBtn = document.getElementById("activate")
const deactivateBtn = document.getElementById("deactivate")

function updateActiveBtn(active) {
    if (active) {
        activateBtn.classList.add("active");
        deactivateBtn.classList.remove("inactive");
    } else {
        activateBtn.classList.remove("active");
        deactivateBtn.classList.add("inactive");
    }
}

function loadState() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = String(tabs[0].id);

        chrome.storage.session.get(tabId, data => {
            updateActiveBtn(Boolean(data[tabId]));
        })
    })
}

document.addEventListener("DOMContentLoaded", loadState);

activateBtn.addEventListener("click", () => {

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const url = tabs[0].url

        if (!url.startsWith("http")) {
            console.log("Error running in this URL. It should start with http.")
            return
        }

        chrome.storage.session.set({ [String(tabs[0].id)]: true }, () => {
            updateActiveBtn(true);
        });

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        },
            () => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    "enable_ruler",
                    () => {
                        if (chrome.runtime.lastError) {
                            console.log("Content script  is not available")
                        }
                    }
                );
            }
        )
    });
});

deactivateBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.storage.session.set({ [String(tabs[0].id)]: false }, () => {
            updateActiveBtn(false);
        });

        chrome.tabs.sendMessage(
            tabs[0].id,
            "disable_ruler"
        )
    })
});
