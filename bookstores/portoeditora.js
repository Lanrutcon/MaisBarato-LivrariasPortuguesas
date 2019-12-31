function getPricePortoEditora(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "portoeditora.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        bookLinks["portoEditora.pt"] = "https://www.portoeditora.pt" + el.querySelectorAll(".product-title > a")[0].href.replace(/^.*\/\/[^\/]+/, '');
        createSpan("PortoEditora.pt: " + el.getElementsByClassName("pvp-price")[0].innerText, bookLinks["portoEditora.pt"]);

        var price = el.getElementsByClassName("pvp-price")[0].innerText;
        priceChecker(price, "portoEditora.pt");
    });
}