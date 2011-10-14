var Translator = {};

(function(){
	var m = Translator;

	//translate the item from "server-side" language to "client side" language
	m.translateItem = function(server){
		var output = {};
		output.startTime = server.starttime*1000;
		output.endTime = server.endtime*1000;
		output.title = unescape(server.title);
		output.url = server.url;
		//console.log(server.importancevalues);
		output.importance = translateImportance(server.importancevalues, output.startTime);
		if(typeof server.keyword == "string"){
			output.keywords = [unescape(server.keyword)]
		}else if(typeof server.keyword == "object"){
			output.keywords = server.keyword;
		}
		output.domain = {name: server.eventtypename, favUrl: server.favicon, color: getDomainColor(server.color, server.eventtypename)};
		output.stream = server.stream;
		output.eventId = server._id;
		return output;
	}

	function getDomainColor(color, name){
		if(color){
			var r = Helper.padZero(color[0].toString(16), 2);
			var g = Helper.padZero(color[1].toString(16), 2);
			var b = Helper.padZero(color[2].toString(16), 2);
			return "#"+r+g+b;
		}
		return "#FF6600";
	}

	function translateImportance(obj, startTime){
		var output = [];
		for(var i in obj){
			var time = i*1000;
			var index = Math.floor((time-startTime)/114000);
			for(var j=0; j<index; j++){
				if(typeof output[j] == "undefined"){
					output[j] = 0;
				}
			}
			output[index] = obj[i];
		}
		return output;
	}
})();
