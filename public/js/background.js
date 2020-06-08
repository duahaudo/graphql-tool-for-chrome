chrome.browserAction.onClicked.addListener((tab1) => {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.url.includes("skedulo")) {
            // Execute script in the current tab
            chrome.tabs.executeScript(tab.id, { code: `localStorage['auth']` }, ([fromPageLocalStore]) => {
                const skedApiAccessToken = JSON.parse(fromPageLocalStore).skedApiAccessToken;
                chrome.tabs.create({ url: `index.html?` + skedApiAccessToken }, (newTab) => {
                    // chrome.tabs.executeScript(newTab.id, { code: `localStorage.setItem('auth', "${skedApiAccessToken}")` })
                })
            });
        } else {
            chrome.tabs.create({ url: 'index.html' })
        };
    })
})

