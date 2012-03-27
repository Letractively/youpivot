O_O.include("/youpivot/js/timemark.js");

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
                console.log(request.terms);
				break;
            case "ping":
                // use AJAX to get info from manifest.json?
                sendResponse({name: "YouPivot & Timemarks (beta)", version: "0.4"});
                break;
            case "addTimeMark":
                TimeMarkManager.add(request.description, request.color);
                break;
			default:
				onRequest(request, sender, sendResponse);
				console.log("Request not recognized by YouPivot");
		}
	});
	/*** end chrome event listeners ***/
});
