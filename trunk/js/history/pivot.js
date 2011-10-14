var PivotManager = {};

(function(){
	var m = PivotManager;

	var pivotInterval = pref("pivotInterval");

	m.pivotItem = function(eventId){
		location.href = "#pivotitem="+eventId;
	}

	function pivotItem(eventId){
        console.log("p");
		var item = findItemByEventId(eventId);
        if(item === false){
            console.log("item is not found");
            return;
        }
        console.log(item);
		var pivotTime = (item.startTime + item.endTime) / 2;
		m.pivot(pivotTime, {"forceReload": false, "callback": function(){
            var row = $("#item_"+item.id);
			HighlightManager.clearHighlight();
			HighlightManager.highlightItem(row, {persistent: true, level: "highlight"});
			HighlightManager.scrollToItem(item.id, 0);
		}, "selection": [item.startTime, item.endTime]});
	}

	function findItemByEventId(eventId){
        var list = ItemManager.list;
        for(var i in list){
            if(list[i] && list[i].eventId == eventId){
                return list[i];
            }
        }
        return false;
	}

	m.pivotUrl = function(time){
		location.href = "#pivot="+time;
	}

	m.pivot = function(time, options){
		//extract options
		var callback = Helper.getOptions(options, "callback", function(){});
		var forceReload = Helper.getOptions(options, "forceReload", true);
		var selection = Helper.getOptions(options, "selection", [time-pivotInterval/2, time+pivotInterval/2]);

		FilterManager.clearFilters();
		SearchManager.antiSearch();
		var range = GraphManager.getRange();
		var midPoint = (range.start+range.end)/2;
		if(Math.abs(time-midPoint)>(range.end-range.start)/4 || forceReload){
			if(!forceReload){
				//request from Pivot button
				DatePicker.setDisplay(new Date(time));
			}
			pivotServer(time, selection, callback);
		}else{
			GraphManager.setSelection(selection[0], selection[1]);
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
			m.pivot(midpoint+pref("pageFlipRange"), {"forceReload": true});
		}else{
			m.pivot(midpoint-pref("pageFlipRange"), {"forceReload": true});
		}
	}

	function pivotServer(time, range, callback){
		Helper.showLoading();
		time = Math.floor(time/1000);
		Connector.send("get", {pivottime: time}, {onSuccess: function(data){
            console.log("success");
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
		//GraphManager.draw();
        GraphManager.drawTopGraph();
        GraphManager.giveDataToStreamGraph();
		GraphManager.setSelection(range[0], range[1], false);
        GraphManager.redrawStreamGraph();
        //GraphManager.drawStreamGraphWithUpdatedScale();
		Helper.hideLoading();
		$("#errorIcon").hide();
	}

    var errorMessage = "Error loading information. Please make sure the background daemon is running and try again. ";
	// Displays an error message if the server cannot be connected
	function pivotOnError(response){
		Helper.hideLoading();
		$("#errorIcon").show();
		$("#visualGraphs").append("<div class='errorMessage' style='position: absolute; left: 100px; top: 200px; z-index: 999999;'>"+errorMessage+"</div>");
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
				m.pivot(pair[1], {"forceReload": false});
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
