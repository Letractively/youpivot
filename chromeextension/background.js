$(function(){
	/*** chrome event listeners ***/
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
		switch(request.action){
			case "getCurrent":
				break;
			default:
				console.log("Unknown internal request received");
		}
	});
	/*** end chrome event listeners ***/
});
