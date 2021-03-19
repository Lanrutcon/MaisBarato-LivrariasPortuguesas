function getPriceLeya(isbn) {
    chrome.runtime.sendMessage({
		contentScriptQuery: "leyaonline.com",
		bookIsbn: isbn
	},
	text => {
		var parser = new DOMParser();
		var el = parser.parseFromString(text, "text/html");
		
		var rawLink = el.querySelectorAll(".img_container > .img > a")[0].href;
		bookLinks["leyaonline.com"] = "https://www.leyaonline.com" + rawLink.substring(rawLink.indexOf("/pt/livros"));

		var price = el.querySelectorAll(".showBook > .price > .right")[0].innerHTML.trim();

		createSpan("Leyaonline.com: " + price, bookLinks["leyaonline.com"]);

		priceChecker(price, "leyaonline.com");
	});
}