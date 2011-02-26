var Connector = {};

//A middle-man to help communicating with the server
(function(){
	var m = Connector;

	var userId = -1;

	m.send = function(eventType, info){
		if(typeof info != "object"){
			throw "info is not an object";
			console.log("Send info to server failed");
			return;
		}
		console.log("sending...");
		updateUserId(function(){ prepareSend(eventType, info); });
	}

	function prepareSend(eventType, info){
		var obj = createSendObj(eventType, info);
		var string = JSON.stringify(obj);
		sendString(string);
	}

	function sendString(string){
		//TODO: actually implement this function
		console.log(string);
	}

	function createSendObj(eventType, info){
		var obj = {info: info};
		obj.eventName = "chromeweb"
		obj.eventType = eventType;
		obj.userId = userId;
		obj.source = "chromeextension";
		return obj;
	}

	function updateUserId(callback){
		try{
			//try accessing UserManager directly first
			userId = UserManager.getId();
			callback();
		}catch(e){
			//access UserManager through background.js
			chrome.extension.sendRequest({action: "getUserId"}, function(id){
				userId = id;
				callback();
			});
		}
	}
})();
