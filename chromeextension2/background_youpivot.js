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
			default:
				console.log("Unknown internal request received");
		}
	});
	/*** end chrome event listeners ***/
});
