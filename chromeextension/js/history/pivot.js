var PivotManager = {};

(function(){
	var m = PivotManager;

	var pivotInterval = 3600000;

	m.pivotItem = function(eventId){
		location.href = "#pivotitem="+eventId;
	}

	function pivotItem(eventId){
		var row = findRowByEventId(eventId);
		var item = row.data("item");
		m.pivot(item.startTime, false, function(){
			var row = findRowByEventId(eventId);
			var item = row.data("item");
			HighlightManager.clearHighlight();
			HighlightManager.highlightItem(row, {persistent: true, level: "highlight"});
			HighlightManager.scrollToItem(item.id, 0);
		});
	}

	function findRowByEventId(eventId){
		var rows = $("#textContent").find(".item");
		for(var i in rows){
			var t = $(rows[i]);
			var item = t.data("item");
			if(item && item.eventId == eventId){
				return t;
			}
		}
	}

	m.pivotUrl = function(time){
		location.href = "#pivot="+time;
	}

	m.pivot = function(time, forceReload, callback){
		if(!callback) callback = function(){};
		SearchManager.antiSearch();
		var range = GraphManager.getRange();
		var midPoint = (range.start+range.end)/2;
		if(Math.abs(time-midPoint)>(range.end-range.start)/4 || forceReload){
			if(!forceReload){
				//request from Pivot button
				DatePicker.setDisplay(new Date(time));
			}
			var range = [time-(pivotInterval/2), time+(pivotInterval/2)];
			pivotServer(time, range, callback);
		}else{
			GraphManager.setSelection(time-(pivotInterval/2), time+(pivotInterval/2));
			GraphManager.finishSelection();
			callback();
		}
	}

	m.pivotRange = function(startRange, endRange){
		console.log("pivot range is not yet implemented");
		console.log(startRange +" ::: "+ endRange);
	}

	m.pageFlip = function(direction){
		//FIXME use pivotRange should be better
		var range = GraphManager.getRange();
		var midpoint = Math.floor((range.end+range.start)/2);
		if(direction>0){
			m.pivot(midpoint+pref("pageFlipRange"), true);
		}else{
			m.pivot(midpoint-pref("pageFlipRange"), true);
		}
	}

	function pivotServer(time, range, callback){
		Helper.showLoading();
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, {onSuccess: function(data){
			pivotOnSuccess(data, time, range); 
			callback();
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
		$("#errorIcon").hide();
	}

	// Displays an error message if the server cannot be connected
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

	//listen for hash change
	$(window).bind("hashchange", function(){
		var hash = location.hash.substr(1); //substring 1 to remove the # sign
		var pairs = hash.split("&");
		var obj = [];
		for(var i in pairs){
			obj[i] = pairs[i].split("=");
			runHash(obj[i]);
		}
	});

	function runHash(pair){
		switch(pair[0]){
			case "pivot":
				m.pivot(pair[1], false);
				break;
			case "pivotitem":
				pivotItem(pair[1]);
				break;
			default: 
				HighlightManager.clearHighlight();
				console.log("Unknown hash value");
				break;
		}
	}

	$(window).bind("itemsLoaded", function(){
		//invoke the window hash change to parse hash when started
		$(window).trigger("hashchange");
	});
})();
