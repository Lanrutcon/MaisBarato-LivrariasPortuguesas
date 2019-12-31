var currentSite = window.location.hostname.replace("www.", "");
var sites = ["bertrand.pt", "wook.pt", "almedina.net", "antigona.pt", "portoeditora.pt", "fnac.pt", "leyaonline.com", "bookdepository.com"];
var isPinned = false;

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
	"fnac.pt": {
        "retrievePrice": getPriceFnac,
        "getPrice": currentSite == sites[5] ? document.querySelectorAll(".f-priceBox-price--reco")[0].innerText.replace("€", "").replace(",", ".").trim() : ""
	},
	"leyaonline.com": {
        //"retrievePrice": NOT IMPLEMENTED DUE TO SITE AJAX CALLS
        "getPrice": currentSite == sites[6] ? document.querySelectorAll(".bookPrice > .wrapperTalble > .price")[0].innerText.replace("€", "").replace(",", ".").trim() : ""
	},
	"bookdepository.com": {
		"retrievePrice": getPriceBookDepository,
        "getPrice": currentSite == sites[7] ? document.querySelectorAll(".sale-price")[0].innerText.replace("€", "").replace(",", ".").trim() : ""
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
	//Fnac
	else if (currentSite.indexOf(sites[5]) != -1) {
		//$(".Feature-item > span.Feature-label:contains(ISBN)").parent().children()[1].innerText
		var elemArray = document.querySelectorAll(".Feature-item > span.Feature-label")
		for (let i = 0; i < elemArray.length; i++) {
			if (elemArray[i].innerText == "ISBN") {
				isbn = elemArray[i].parentElement.children[1].innerText;
				break;
			}
		}
    }
	//Leya
    else if (currentSite.indexOf(sites[6]) != -1) {
        isbn = document.querySelectorAll("span[itemprop='identifier']")[0].innerText.replace(/-/g, '');
    }
	//BookDepository
    else if (currentSite.indexOf(sites[7]) != -1) {
        isbn = document.querySelectorAll("span[itemprop='isbn']")[0].innerText.replace(/-/g, '');
    }

    isbn = isbn.replace(/-/g, '');
    return isbn;
}

function retrieveBookInfo(isbn) {
    for (let i = 0; i < sites.length; i++) {
		if(sitesPrice[sites[i]]["retrievePrice"])
			sitesPrice[sites[i]]["retrievePrice"](isbn);
    }

    createTooltip();
}



function priceChecker(realPrice, site) {
    var price = Number(realPrice.replace("€", "").replace(",", "."));
    sitesPrice[site]["price"] = price;
    if (price < Number(sitesPrice[currentSite]["getPrice"]))
		createToast();
	
	if (isPinned && priceTooltip.style.display == "none") {
		toggleTooltip(1)
	}
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
	
	var pinImg = document.createElement("img");
	pinImg.classList.add("pinImg");
	pinImg.src = browser.runtime.getURL("pin.svg");
	priceTooltip.appendChild(pinImg);
	
	
	pinImg.onclick = function() {
		pinImg.classList.toggle("blackWhite");
		isPinned = !isPinned;
		
		var storeValue = { "isPinned": isPinned };
		browser.storage.local.set(storeValue);
		
		clearTimeout(t);
	}
	
	priceTooltip.pin = pinImg;

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
	//Fnac
    else if (currentSite.indexOf(sites[5]) != -1) {
        elem = document.getElementsByClassName("f-productOffer-priceBox")[0];
    }
	//Leya
    else if (currentSite.indexOf(sites[6]) != -1) {
        elem = document.querySelectorAll(".bookPrice > .wrapperTalble > .price")[0];
    }
	//BookDepository
    else if (currentSite.indexOf(sites[7]) != -1) {
        elem = document.querySelectorAll(".sale-price")[0];
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
    if (show == 0 && !isPinned) {
        clearTimeout(t);
        t = setTimeout(function () {
                priceTooltip.style.display = "none";
            }, 500);
    } else {
        priceTooltip.style.display = "";
    }
}

function onMouseOver() {
    if (priceTooltip.style.display == "none" || isPinned)
        return;
    toggleTooltip(1);
    clearTimeout(t);
    t = setTimeout(function () {
            toggleTooltip(0);
        }, 2000);
}

function onMouseEnter(event) {
    clearTimeout(t);
    toggleTooltip(1);
}

function onMouseOut(event) {
	if(isPinned)
		return;
    clearTimeout(t);
    t = setTimeout(function () {
            toggleTooltip(0);
        }, 2000);
}

//Local cache
browser.storage.local.get("isPinned", function(result){
	isPinned = result.isPinned;
	if(isPinned)
		priceTooltip.pin.classList.add("blackWhite");
});


//Misc functions
function formatPrice(price) {
	return Number(price).toLocaleString("pt-PT", {style: "currency", currency: "EUR", minimumFractionDigits: 2});
}

//StartUp function
retrieveBookInfo(getBookISBN());
