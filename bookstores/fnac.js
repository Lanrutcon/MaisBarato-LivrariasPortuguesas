function getPriceFnac(isbn) {
    chrome.runtime.sendMessage({
		contentScriptQuery: "fnac.pt",
		bookIsbn: isbn
	},
	text => {
		var parser = new DOMParser();
		var el = parser.parseFromString(text, "text/html");

		if (el.getElementsByClassName("userPrice")[0] == undefined)
			return;

		var price = el.getElementsByClassName("userPrice")[0].innerText.trim();
		price = price.replace("€", "").replace(",", ".");

		bookLinks["fnac.pt"] = el.querySelector(".Article-title").href;
		createSpan("Fnac.pt: " + price.replace(".", ",") + "€", bookLinks["fnac.pt"]);
		priceChecker(price, "fnac.pt");
	});
}