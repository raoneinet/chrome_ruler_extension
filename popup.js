let active = false;

document.getElementById("toggle").onclick = () => {
    active = !active;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            active ? "enable_ruler" : "disable_ruler"
        );
    });
};
