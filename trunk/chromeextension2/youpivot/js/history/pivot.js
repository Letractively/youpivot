include("/js/urlhash.js");

var PivotManager = {};

(function(){
	var m = PivotManager;

	var pivotInterval = pref("pivotInterval");

	m.pivotItem = function(eventId){
        pivotItem(eventId);
        URLHash.setHash("pivotitem", eventId);
	}

	function pivotItem(eventId){
		var item = findItemByEventId(eventId);
        if(item === false){
            console.log("item is not found");
            return;
        }
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
        m.pivotItem(item);
        URLHash.setHash("pivot", time);
	}

	m.pivot = function(time, options){
		//extract options
		var callback = Helper.getOptions(options, "callback", function(){});
		var forceReload = Helper.getOptions(options, "forceReload", true);
		var selection = Helper.getOptions(options, "selection", [time-pivotInterval/2, time+pivotInterval/2]);

		FilterManager.clearFilters();
		SearchManager.antiSearch();
		var range = GraphManager.getLoadedRange();
		var midPoint = (range.start+range.end)/2;
		if(Math.abs(time-midPoint)>(range.end-range.start)/4 || forceReload){
			pivotServer(time, selection, callback);
		}else{
			GraphManager.setDisplayRange(selection[0], selection[1]);
			callback();
            $(window).trigger("pivot");
		}
	}

	m.pivotRange = function(startRange, endRange){
		console.log("pivot range is not yet implemented");
		console.log(startRange +" ::: "+ endRange);
	}

	m.pageFlip = function(direction){
		//FIXME use pivotRange should be better
		var range = GraphManager.getLoadedRange();
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
		GraphManager.startLoadingData(time*1000-43200000, time*1000+43199999); //FIXME load from server
		ItemManager.clear();
		ItemManager.addItems(arr);
        GraphManager.finishLoadingData(range[0], range[1]);
		Helper.hideLoading();
        $(window).trigger("pivot");
	}

    var errorMessage = "Error loading information. Please make sure the background daemon is running and try again. ";
    var errorIcon = "<div id='errorIcon' />";
	// Displays an error message if the server cannot be connected
	function pivotOnError(response){
        $("#y-spinner").hide();
		$("#blocker").html("<div class='errorMessage' style='text-align: middle; position: relative; top: 200px;'>"
                + errorIcon + "<br />" + errorMessage + "</div>")
            .css("background-color", "rgba(180, 180, 180, 0.7)").css("cursor", "default");
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

    URLHash.onHashValueChange("pivot", function(time){
        m.pivot(time, {"forceReload": false});
    });
    URLHash.onHashValueChange("pivotitem", function(item){
        m.pivotItem(item);
    });

})();
