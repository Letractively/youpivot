var Connector = {};

//A middle-man to help communicating with the server
(function(){
	var m = Connector;

	var serverUrl = "http://127.0.0.1:8080/";
	var developerId = "e34c5ee0d846e882ae1014294b002a14";
	var userId = -1;

	m.send = function(eventType, info, callback){
		if(typeof info != "object"){
			throw "info is not an object";
			console.log("Send info to server failed");
			return;
		}
		console.log("sending...");
		updateUserId(function(){ prepareSend(eventType, info, callback); });
	}

	function prepareSend(eventType, info, callback){
		var obj = createSendObj(eventType, info);
		var string = createSendString(obj);
		sendString(eventType, string, callback);
	}

	function sendString(type, string, callback){
		var url = serverUrl+type+"?"+string;
		ajaxGet(url, function(data){if(callback) sendCallbackData(callback, data);});
		console.log(url);
	}

	function sendCallbackData(callback, data){
		if(typeof callback == "function"){
			callback(data);
		}else{
			chrome.extension.sendRequest({action: callback, data: data});
		}
	}

	function ajaxGet(url, callback){
		$.ajax({
			url: url,
			success: function(data){
				callback(data);
			}
		});
	}

	var mandatory = {};
	mandatory["add"] = ["title", "keyword", "starttime", "endtime", "favicon", "url", "eventtypename"];
	mandatory["get"] = ["pivottime"];
	function createSendObj(eventType, info){
		var obj = info;
		var man = mandatory[eventType];
		for(var i in man){
			if(obj[man[i]]==undefined){
				throw "One of the mandatory fields are undefined: "+man[i];
				return false;
			}
		}
		if(eventType == "add"){
			obj.developerid = developerId;
		}

		obj.userid = userId;
		return obj;
	}

	function createSendString(obj){
		var arr = [];
		for(var i in obj){
			arr[arr.length] = i+"="+escape(obj[i]);
		}
		return arr.join("&");
	}

	function updateUserId(callback){
		if(typeof UserManager != "undefined"){
			//try accessing UserManager directly first
			console.log("Using UserManager");
			userId = UserManager.getId();
			callback();
		}else{
			//access UserManager through background.js
			console.log("Getting userId through background");
			chrome.extension.sendRequest({action: "getUserId"}, function(id){
				userId = id;
				callback();
			});
		}
	}
})();