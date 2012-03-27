var TimeMarkManager = new (function _TimeMarkManager (){
    var self = this;

	var timeMarkIcon = "images/timemark.png";
    var timeMarkIconPrefix = "images/timeMarkMarks/timemark_32_";
    var hexCodes = {"red": "#BB001A", "black": "#282828", "blue": "#106ABE", "darkBlue": "#0A28A3", "darkGreen": "#0C4711", "green": "#21A817", "orange": "#BB690C", "purple": "#50009B", "silver": "#6F6F6F", "yellow": "#C9C00E"};

	chrome.extension.onRequest.addListener(function(request){
		if(request.action=="timemarkCallback"){
			timemarkCallback(request.data);
		}
	});

	self.add = function(description, color){
		var time = new Date().getTime();
		var info = createObj(description, color, time);
        Connector.send("add", info);
		console.log(description, new Date(time).toLocaleString());
	}

	function createObj(description, color, time){
		var obj = {};
		obj.title = description;
		obj.url = "#pivot="+Math.floor(time/1000);
		obj.favicon = timeMarkIconPrefix + color + ".png";
        obj.color = hexCodes[color];
		obj.keyword = description.split(' ');
		obj.starttime = Math.floor(time/1000);
		obj.endtime = Math.floor((time+1)/1000);
		obj.eventtypename = color+" timemark";
		obj.stream = "timemark";
		return obj;
	}

    /*
	function send(info){
		//info.eventType = "timemark";
		chrome.extension.sendRequest({action: "uploadInfo", eventType: "add", info: info, callback: "timemarkCallback"});
	}

	function timemarkCallback(data){
		if(data.length>0){
			window.close();
		}else{
			alert("error: "+data); //FIXME
		}
	}
    */
})();
