function getPriceWook(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "wook.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");
        
        var price = JSON.parse(el.getElementsByTagName("script")[1].innerHTML).offers.price;
        price = price.replace("€", "").replace(",", ".");

        bookLinks["wook.pt"] = el.querySelectorAll("meta[property='og:url']")[0].content;
        createSpan("Wook.pt: " + price.replace(".", ",") + "€", bookLinks["wook.pt"]);
        priceChecker(price, "wook.pt");
    });
}