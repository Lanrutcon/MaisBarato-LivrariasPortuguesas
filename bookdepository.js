function getPriceBookDepository(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "bookdepository.com",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");
		debugger;
        bookLinks["bookdepository.com"] = el.querySelectorAll("link[rel='canonical']")[0].getAttribute("href");
        createSpan("BookDepository.com: " + formatPrice(el.querySelectorAll("a[data-isbn='" + isbn + "']")[0].getAttribute("data-price")), bookLinks["bookdepository.com"]);

        var price = el.querySelectorAll("a[data-isbn='" + isbn + "']")[0].getAttribute("data-price");
        price = price.replace("€", "").replace(",", ".");
        priceChecker(price, "bookdepository.com");
    });
}
