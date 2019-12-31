function getPriceFnac(isbn) {
    chrome.runtime.sendMessage({
		contentScriptQuery: "fnac.pt",
		bookIsbn: isbn
	},
	text => {
		var parser = new DOMParser();
		var el = parser.parseFromString(text, "text/html");
		
		bookLinks["fnac.pt"] = el.querySelectorAll(".Article-title")[0].href;

		var price = el.getElementsByClassName("userPrice")[0].innerText.trim();

		createSpan("Fnac.pt: " + price, bookLinks["fnac.pt"]);

		priceChecker(price, "fnac.pt");
	});
}