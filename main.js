var currentSite = window.location.hostname.replace("www.", "");
var sites = ["bertrand.pt", "wook.pt", "almedina.net", "antigona.pt", "portoeditora.pt", "bookdepository.com"];

var sitesPrice = {
    "bertrand.pt": {
        "retrievePrice": getPriceBertrand,
        "getPrice": currentSite == sites[0] ? document.getElementsByClassName("current")[0].innerText.replace("€", "").replace(",", ".") : ""
    },
    "wook.pt": {
        "retrievePrice": getPriceWook,
        "getPrice": currentSite == sites[1] ? document.getElementsByClassName("current")[0].getAttribute("data-price").replace("€", "").replace(",", ".") : ""
    },
    "almedina.net": {
        "retrievePrice": getPriceAlmedina,
        "getPrice": currentSite == sites[2] ? document.getElementById("product_addtocart_form").querySelectorAll(".price")[0].innerText.replace("€", "").replace(",", ".").trim() : ""
    },
    "antigona.pt": {
        "retrievePrice": getPriceAntigona,
        "getPrice": currentSite == sites[3] ? document.querySelectorAll("meta[property='og:price:amount']")[0].content : ""
    },
    "portoeditora.pt": {
        "retrievePrice": getPricePortoEditora,
        "getPrice": currentSite == sites[4] ? document.querySelectorAll(".product-price-sale")[0].innerText.replace("€", "").replace(",", ".") : ""
    },
	"bookdepository.com": {
		"retrievePrice": getPriceBookDepository,
        "getPrice": currentSite == sites[5] ? document.querySelectorAll(".sale-price")[0].innerText.replace("€", "").replace(",", ".").trim() : ""
	}
};

var priceTooltip;
var bookLinks = {};

function getBookISBN() {
    var isbn;
    //Bertrand & Wook
    if (currentSite.indexOf(sites[0]) != -1 || currentSite.indexOf(sites[1]) != -1)
        isbn = document.getElementById("productPageSectionDetails-collapseDetalhes-content-isbn").querySelectorAll("span")[0].innerText;
    //Almedina
    else if (currentSite.indexOf(sites[2]) != -1) {
        var arr = Array.prototype.slice.call(document.querySelectorAll(".prod-details-wrapper > ul > li"));
        arr.forEach(function (i) {
            if (i.innerText.indexOf("ISBN") != -1) {
                isbn = i.innerText.split(":")[1].trim();
            }
        });
    }
    //Antigona
    else if (currentSite.indexOf(sites[3]) != -1) {
        isbn = document.querySelectorAll('div.product-description > ul > li:last-child')[0].innerText.replace(/-/g, '').replace("ISBN", "").trim();
    }
    //Porto Editora
    else if (currentSite.indexOf(sites[4]) != -1) {
        isbn = document.querySelectorAll('[itemprop="isbn"]')[0].innerText.replace(/-/g, '');
    }

    isbn = isbn.replace(/-/g, '');

    return isbn;
}

function retrieveBookInfo(isbn) {
    for (let i = 0; i < sites.length; i++) {
        sitesPrice[sites[i]]["retrievePrice"](isbn);
    }

    createTooltip();
}

function getPriceBertrand(isbn) {
    chrome.runtime.sendMessage({
        contentScriptQuery: "bertrand.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        bookLinks["bertrand.pt"] = "https://www.bertrand.pt" + el.getElementsByClassName("title-lnk track")[0].href.replace(/^.*\/\/[^\/]+/, '');
        createSpan("Bertrand.pt: " + el.getElementsByClassName("active-price")[0].innerText, bookLinks["bertrand.pt"]);

        var price = el.getElementsByClassName("active-price")[0].innerText;
        price = price.replace("€", "").replace(",", ".");
        priceChecker(price, "bertrand.pt");
    });
}

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

function getPriceAntigona(isbn) {
    isbn = isbn.replace(/(.{3})/g, "$1-");
    chrome.runtime.sendMessage({
        contentScriptQuery: "antigona.pt",
        bookIsbn: isbn
    },
        text => {
        var parser = new DOMParser();
        var el = parser.parseFromString(text, "text/html");

        bookLinks["antigona.pt"] = "https://www.antigona.pt" + el.getElementsByClassName("product-grid-item")[0].href.replace(/^.*\/\/[^\/]+/, '');
        //format price
        var price = el.getElementsByClassName("visually-hidden")[1].innerText;
        price = price.replace("€", "").replace(".", ",") + "€";

        createSpan("Antigona.pt: " + price, bookLinks["antigona.pt"]);

        price = price.replace("€", "").replace(",", ".");
        priceChecker(price, "antigona.pt");
    });
}

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

function priceChecker(realPrice, site) {
    var price = realPrice.replace("€", "").replace(",", ".");
    sitesPrice[site]["price"] = price;
    if (price < sitesPrice[currentSite]["getPrice"])
        createToast();
}

function createSpan(text, link) {
    var span = document.createElement("a");
    span.innerText = text;
    span.href = link;
    span.target = "_blank";
    priceTooltip.appendChild(span);
}

function createTooltip() {
    priceTooltip = document.createElement("div");
    priceTooltip.classList.add("pricesTooltip");
    priceTooltip.innerHTML = "<h5>Outras livrarias</h5>";
    priceTooltip.style.display = "none";

    var elem;
    //Bertrand & Wook
    if (currentSite.indexOf(sites[0]) != -1 || currentSite.indexOf(sites[1]) != -1) {
        elem = document.getElementById("productPageRightSectionTop-saleAction-price-current");
    }
    //Almedina
    else if (currentSite.indexOf(sites[2]) != -1) {
        elem = document.getElementsByClassName("prod-sale-section")[0].querySelectorAll(".price-wrapper")[0];
    }
    //Antigona
    else if (currentSite.indexOf(sites[3]) != -1) {
        elem = document.getElementById("productPrice-product-template");
    }
    //Porto Editora
    else if (currentSite.indexOf(sites[4]) != -1) {
        elem = document.getElementsByClassName("product-price-sale")[0];
    }

    elem.onmouseenter = onMouseEnter;
    elem.onmouseout = onMouseOut;
    priceTooltip.onmouseover = onMouseOver;
    document.body.appendChild(priceTooltip);
}

function createToast() {
    if (document.getElementById("toast") == undefined) {
        var toast = document.createElement("div");
        toast.id = "toast";
        toast.innerHTML = "Existe pelo menos uma livraria com um preço mais barato";
        document.body.appendChild(toast);

        toast.className = "show";

        toast.onclick = function () {
            toggleTooltip(1);
        }
        setTimeout(function () {
            toast.className = toast.className.replace("show", "");
        }, 8000);
    }
}

var t;

//Events
function toggleTooltip(show) {
    priceTooltip.style.opacity = show;
    if (show == 0) {
        clearTimeout(t);
        t = setTimeout(function () {
                priceTooltip.style.display = "none";
            }, 500);
    } else {
        priceTooltip.style.display = "";
    }
}

function onMouseOver() {
    if (priceTooltip.style.display == "none")
        return;
    toggleTooltip(1);
    clearTimeout(t);
    t = setTimeout(function () {
            toggleTooltip(0);
        }, 2000);
}

function onMouseEnter(event) {
    clearTimeout(t);
    toggleTooltip(1, event.clientX, event.clientY);
}

function onMouseOut(event) {
    clearTimeout(t);
    t = setTimeout(function () {
            toggleTooltip(0);
        }, 2000);
}



function formatPrice(price) {
	return Number(price).toLocaleString("pt-PT", {style: "currency", currency: "EUR", minimumFractionDigits: 2});
}

//StartUp function
retrieveBookInfo(getBookISBN());
