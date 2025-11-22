chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    if(changeInfo.status === "loading"){
        chrome.storage.session.remove(String(tabId));
    }
});

chrome.tabs.onRemoved.addListener((tabId)=>{
    chrome.storage.session.remove(String(tabId))
})