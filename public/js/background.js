chrome.browserAction.onClicked.addListener((tab1) => {
    chrome.tabs.query({ title: "GraphQL tools by Stiger" }, (tabs) => {

    })

    openNewTab();
})

const openNewTab = () => {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0]
        if (tab.url.includes("skedulo")) {
            // Execute script in the current tab
            chrome.tabs.executeScript(tab.id, { code: `localStorage['auth']` }, ([fromPageLocalStore]) => {
                const skedApiAccessToken = JSON.parse(fromPageLocalStore).skedApiAccessToken;
                chrome.tabs.create({ url: `index.html?` + skedApiAccessToken, active: true }, (newTab) => {
                    // const code = `localStorage.setItem('skedToken', "${skedApiAccessToken}")`
                    // chrome.tabs.executeScript(newTab.id, { code })
                })
            });
        } else {
            chrome.tabs.create({ url: 'index.html' })
        };
    })
}
