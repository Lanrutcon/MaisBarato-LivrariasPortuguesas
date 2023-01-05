function getPriceLeya(isbn) {
    chrome.runtime.sendMessage({
		contentScriptQuery: "leyaonline.com",
		bookIsbn: isbn
	},
	text => {
		var parser = new DOMParser();
		var el = parser.parseFromString(text, "text/html");

		var rawLink = el.querySelector(".book-card a");
		if (rawLink == undefined)
			return;

		var booksPrices = el.querySelectorAll(".book-card > a > .single-book-price > h6");
		var price = booksPrices[0].innerText.split("\n")[2].trim();
		price = price.replace("€", "").replace(",", ".");

		bookLinks["leyaonline.com"] = rawLink;
		createSpan("Leyaonline.com: " + price.replace(".", ",") + "€", bookLinks["leyaonline.com"]);
		priceChecker(price, "leyaonline.com");
	});
}