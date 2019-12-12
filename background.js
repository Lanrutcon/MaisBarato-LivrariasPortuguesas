chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.contentScriptQuery == "bertrand.pt") {
        fetch("https://www.bertrand.pt/pesquisa/" + request.bookIsbn)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse(error))
        return true;
    } else if (request.contentScriptQuery == "wook.pt") {
        fetch("https://www.wook.pt/pesquisa/" + request.bookIsbn)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse(error))
        return true;
    } else if (request.contentScriptQuery == "almedina.net") {
        fetch("https://www.almedina.net/catalogsearch/result/?q=" + request.bookIsbn)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse(error))
        return true;
    } else if (request.contentScriptQuery == "portoeditora.pt") {
        fetch("https://www.portoeditora.pt/pesquisa?q=" + request.bookIsbn)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse(error))
        return true;
    } else if (request.contentScriptQuery == "antigona.pt") {
        fetch("https://www.antigona.pt/search?type=product&q=" + request.bookIsbn)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse(error))
        return true;
    } else if (request.contentScriptQuery == "bookdepository.com") {
		debugger;
        fetch("https://www.bookdepository.com/search?searchTerm=" + request.bookIsbn)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse(error))
        return true;
    }	
});
