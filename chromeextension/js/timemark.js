var TimeMarkManager = {};

(function(){
	var m = TimeMarkManager;

	var timeMarkIcon = "images/timemark.png";

	chrome.extension.onRequest.addListener(function(request){
		if(request.action=="timemarkCallback"){
			timemarkCallback(request.data);
		}
	});

	m.add = function(description){
		var time = new Date().getTime();
		var info = createObj(description, time);
		send(info);
		console.log(description, new Date(time).toLocaleString());
	}

	function createObj(description, time){
		var obj = {};
		obj.title = description;
		obj.url = "http://www.youpivot.com/"; //FIXME
		obj.favicon = timeMarkIcon;
		obj.keyword = description.split(' ')[0]; //FIXME upload all keywords (not [0])
		obj.starttime = Math.floor(time/1000);
		obj.endtime = Math.floor((time+1)/1000);
		obj.eventtypename = "timemark";
		return obj;
	}

	function send(info){
		info.eventType = "timemark";
		chrome.extension.sendRequest({action: "uploadInfo", eventType: "add", info: info, callback: "timemarkCallback"});
	}

	function timemarkCallback(data){
		if(data.length>0){
			window.close();
		}else{
			alert("error: "+data); //FIXME
		}
	}
})();
