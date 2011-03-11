var PivotManager = {};

(function(){
	var m = PivotManager;

	var pivotInterval = 3600000;
	m.pivot = function(time){
		SearchManager.antiSearch();
		var range = GraphManager.getRange();
		var midPoint = (range.start+range.end)/2;
		if(Math.abs(time.getTime()-midPoint)>(range.end-range.start)/4){
			pivotServer(time);
		}else{
			var t = time.getTime();
			GraphManager.setSelection(t-(pivotInterval/2), t+(pivotInterval/2));
		}
	}

	function pivotServer(time){
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, function(data){
			if(data=="Bad User"){ alert(data); return; }
			var obj = JSON.parse(data);
			var arr = createItemsArray(obj);
			console.log(arr);
			GraphManager.setRange([time*1000-43200000, time*1000+43200000]); //FIXME load from server
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
		output.title = server.title;
		output.url = server.url;
		output.keywords = [server.keyword];
		output.domain = {name: server.domain, favUrl: server.favicon, color: "#FF0000"}; //FIXME
		return output;
	}
})();
