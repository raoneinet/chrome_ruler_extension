let active = false;

document.getElementById("activate").onclick = () => {
    active = true;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "enable_ruler"
        );
    });

    if(active === true){
        document.querySelector("#activate").classList.add("active")
    }
};

document.getElementById("deactivate").onclick = ()=> {
    active = false;
    chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        chrome.tabs.sendMessage(
            tabs[0].id,
            "disable_ruler"
        )
    })

    if(active === false){
        document.querySelector("#activate").classList.remove("active")
    }
}
