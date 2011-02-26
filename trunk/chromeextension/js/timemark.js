var TimeMarkManager = {};

(function(){
	var m = TimeMarkManager;

	var timeMarkIcon = "images/timemark.png";

	m.add = function(description){
		var time = new Date().getTime();
		var info = {description: description, time: time};
		send("timemark", info);
		console.log(description, new Date(time).toLocaleString());
	}

	function createObj(description, time){
		var obj = {};
		obj.title = description;
		obj.url = ""; //FIXME
		obj.favUrl = timeMarkIcon;
		obj.keywords = description.split(' ');
		obj.startTime = time;
		obj.endTime = time+1;
	}

	function send(eventType, info){
		chrome.extension.sendRequest({action: "uploadInfo", eventType: eventType, info: info});
	}
})();
