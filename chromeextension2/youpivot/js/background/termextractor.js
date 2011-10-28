var text = document.body.innerText;
var arr = text.split(/\s/g);
chrome.extension.sendRequest({action: "saveTerms", terms: arr});
