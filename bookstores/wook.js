function getPriceWook(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "wook.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        bookLinks["wook.pt"] = el.querySelectorAll("meta[property='og:url']")[0].content;
        createSpan("Wook.pt: " + el.getElementById("productPageRightSectionTop-saleAction-price-current").getAttribute("data-price"), bookLinks["wook.pt"]);

        var price = el.getElementById("productPageRightSectionTop-saleAction-price-current").getAttribute("data-price");
        price = price.replace("€", "").replace(",", ".");
        priceChecker(price, "wook.pt");
    });
}