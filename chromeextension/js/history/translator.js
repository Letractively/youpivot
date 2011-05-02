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
		output.domain = {name: server.eventtypename, favUrl: server.favicon, color: getDomainColor(server.eventtypename)}; //FIXME
		output.stream = server.stream;
		output.eventId = server._id;
		return output;
	}

	function getDomainColor(name){
		switch(name){
			case "google.com":
				return "#018F3D";
			case "facebook.com":
				return "#3B5998";
			case "jquery.com":
				return "#235676";
			case "docs.jquery.com":
				return "#235676";
			case "api.jquery.com":
				return "#235676";
			case "forum.jquery.com":
				return "#235676";
			case "nytimes.com":
				return "#333333";
			case "news.ycombinator.com":
				return "#FF6600";
			case "developer.mozilla.org":
				return "#AA0000";
			case "macrumors.com":
				return "#A00000";
			case "engadget.com":
				return "#8BC4CE";
			case "lifehacker.com":
				return "#6C663F";
			case "apple.com":
				return "#9A9A9A";
			case "processingjs.org":
				return "#024779";
			default: 
				return "#FF0000";
				break;
		}
	}

	function translateImportance(obj, startTime){
		var output = [];
		var run = false;
		//console.log(obj);
		for(var i in obj){
			run = true;
			var time = i*1000;
			var index = Math.floor((time-startTime)/114000);
			for(var j=0; j<index; j++){
				if(typeof output[j] == "undefined"){
					output[j] = 0;
				}
			}
			output[index] = obj[i];
		}
		if(!run){
			//console.log("The thing did not run at all. ");
			return [];
		}
		return output;
	}
})();
