$(function(){
	/*** chrome event listeners ***/
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
		console.log("Internal request:", request.action);
		switch(request.action){
			case "getUserId":
				sendResponse(UserManager.getId());
				break;
			case "uploadInfo":
				Connector.send(request.eventType, request.info, request.callback);
				break;
			case "saveTerms":
                throw "saveTerms is deprecated";
				break;
            case "ping":
                // use AJAX to get info from manifest.json?
                sendResponse({name: "YouPivot & Timemarks (alpha)", version: "0.1"});
                break;
			default:
				console.log("Unknown internal request received");
		}
	});
	/*** end chrome event listeners ***/
});
