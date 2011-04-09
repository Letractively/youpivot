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
			var range = [time-(pivotInterval/2), time+(pivotInterval/2)];
			pivotServer(time, range);
		}else{
			GraphManager.setSelection(time-(pivotInterval/2), time+(pivotInterval/2));
		}
	}

	m.pivotRange = function(startRange, endRange){
		console.log("pivot range is not yet implemented");
		console.log(startRange +" ::: "+ endRange);
	}

	function pivotServer(time, range){
		Helper.showLoading();
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, {onSuccess: function(data){
			pivotOnSuccess(data, time, range); 
		}, onError: pivotOnError});
	}

	function pivotOnSuccess(data, time, range){
		if(data=="Bad User"){ alert(data); return; }
		var obj = JSON.parse(data);
		var arr = createItemsArray(obj);
		//console.log(arr);
		GraphManager.setRange([time*1000-43200000, time*1000+43199999]); //FIXME load from server
		ItemManager.clear();
		ItemManager.addItems(arr);
		GraphManager.draw();
		Helper.hideLoading();
		GraphManager.setSelection(range[0], range[1]);
	}

	function pivotOnError(data){
		alert("Error pivoting. "+data);
	}

	function createItemsArray(obj){
		var output = [];
		for(var i in obj.rows){
			output[i] = Translator.translateItem(obj.rows[i].value);
		}
		return output;
	}
})();
