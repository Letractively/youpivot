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
			GraphManager.finishSelection();
		}
	}

	m.pivotRange = function(startRange, endRange){
		console.log("pivot range is not yet implemented");
		console.log(startRange +" ::: "+ endRange);
	}

	m.pageFlip = function(direction){
		var range = GraphManager.getRange();
		var midpoint = Math.floor((range.end+range.start)/2);
		if(direction>0){
			m.pivot(midpoint+pref("pageFlipRange"), true);
		}else{
			m.pivot(midpoint-pref("pageFlipRange"), true);
		}
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

	function pivotOnError(response){
		Helper.hideLoading();
		$("#errorIcon").show();
		$("#streamGraph").html("<div class='errorMessage'>Error loading information from server. Please try again. </div>");
	}

	function createItemsArray(obj){
		var output = [];
		for(var i in obj.rows){
			output[i] = Translator.translateItem(obj.rows[i].value);
		}
		return output;
	}

	$("#graphMoveLeft").click(function(){
		m.pageFlip(-1);
	});
	$("#graphMoveRight").click(function(){
		m.pageFlip(1);
	});
	$("#moveLeftRow").click(function(){
		m.pageFlip(-1);
	});
	$("#moveRightRow").click(function(){
		m.pageFlip(1);
	});
})();
