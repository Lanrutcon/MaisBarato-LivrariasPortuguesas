function getPriceBertrand(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "bertrand.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        bookLinks["bertrand.pt"] = "https://www.bertrand.pt" + el.getElementsByClassName("title-lnk track")[0].href.replace(/^.*\/\/[^\/]+/, '');
        createSpan("Bertrand.pt: " + el.getElementsByClassName("active-price")[0].innerText, bookLinks["bertrand.pt"]);

        var price = el.getElementsByClassName("active-price")[0].innerText;
        price = price.replace("€", "").replace(",", ".");
        
        priceChecker(price, "bertrand.pt");
    });
}