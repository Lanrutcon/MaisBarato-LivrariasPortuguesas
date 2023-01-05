function getPriceAntigona(isbn) {
    isbn = isbn.replace(/(.{3})/g, "$1-");
    chrome.runtime.sendMessage({
        contentScriptQuery: "antigona.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        if (el.getElementsByClassName("product-grid-item")[0] == undefined)
            return;

        bookLinks["antigona.pt"] = "https://www.antigona.pt" + el.getElementsByClassName("product-grid-item")[0].href.replace(/^.*\/\/[^\/]+/, '');
        //format price
        var price = el.getElementsByClassName("visually-hidden")[1].innerText;
        price = price.replace("€", "").replace(".", ",") + "€";

        createSpan("Antigona.pt: " + price, bookLinks["antigona.pt"]);

        price = price.replace("€", "").replace(",", ".");
        priceChecker(price, "antigona.pt");
    });
}
