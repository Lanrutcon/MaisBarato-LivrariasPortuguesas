function getPriceAlmedina(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "almedina.net",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        bookLinks["almedina.net"] = el.querySelectorAll("meta[property='og:url']")[0].content;
        //format price
        var price = el.querySelectorAll(".prod-sale-section")[0].querySelectorAll(".price")[0].innerText;
        price = price.replace(" ", "");

        createSpan("Almedina.net: " + el.querySelectorAll(".prod-sale-section")[0].querySelectorAll(".price")[0].innerText, bookLinks["almedina.net"]);

        price = price.replace("€", "").replace(",", ".").trim();
        priceChecker(price, "almedina.net");
    });
}