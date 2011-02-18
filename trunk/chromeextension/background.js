$(function(){
	/*** chrome event listeners ***/
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
		switch(request.action){
			case "getCurrent":
				var id = Monitor.getSelectedId();
				if(!id){ console.log("cannot get current id"); break; }
				var obj = Monitor.getTabById(id);
				sendResponse(obj);
				break;
			default:
				console.log("Unknown internal request received");
		}
	});
	/*** end chrome event listeners ***/
});
