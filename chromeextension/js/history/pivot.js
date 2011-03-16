var PivotManager = {};

(function(){
	var m = PivotManager;

	var pivotInterval = 3600000;
	m.pivot = function(time, forceReload){
		SearchManager.antiSearch();
		var range = GraphManager.getRange();
		var midPoint = (range.start+range.end)/2;
		if(Math.abs(time-midPoint)>(range.end-range.start)/4 || forceReload){
			if(!forceReload){
				//request from Pivot button
				DatePicker.setDisplay(new Date(time));
			}
			pivotServer(time);
		}else{
			GraphManager.setSelection(time-(pivotInterval/2), time+(pivotInterval/2));
		}
	}

	function pivotServer(time){
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, function(data){
			if(data=="Bad User"){ alert(data); return; }
			console.log(data);
			var obj = JSON.parse(data);
			console.log(obj);
			var arr = createItemsArray(obj);
			//console.log(arr);
			GraphManager.setRange([time*1000-43200000, time*1000+43199999]); //FIXME load from server
			ItemManager.clear();
			ItemManager.addItems(arr);
			GraphManager.draw();
		});
	}

	function createItemsArray(obj){
		var output = [];
		for(var i in obj.rows){
			output[i] = translateItem(obj.rows[i].value);
		}
		return output;
	}

	//translate the item from "server-side" language to "client side" language
	function translateItem(server){
		var output = {};
		output.startTime = server.starttime*1000;
		output.endTime = server.endtime*1000;
		output.title = unescape(server.title);
		output.url = server.url;
		//console.log(server.importancevalues);
		output.importance = translateImportance(server.importancevalues, output.startTime);
		output.keywords = [unescape(server.keyword)];
		output.domain = {name: server.domain, favUrl: server.favicon, color: "#FF0000"}; //FIXME
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
