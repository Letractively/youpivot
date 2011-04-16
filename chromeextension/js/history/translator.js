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
		output.domain = {name: server.eventtypename, favUrl: server.favicon, color: "#FF0000"}; //FIXME
		return output;
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
