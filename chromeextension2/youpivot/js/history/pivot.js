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
			HighlightManager.clearHighlight();
            var id = ItemManager.getItemByEventId(item.eventId).id;
            HighlightManager.clickOnGraph(id);
		}, "selection": [item.startTime, item.endTime]});
	}

	function findItemByEventId(eventId){
        var list = ItemManager.list;
        for(var i in list){
            if(list[i] && list[i].eventId == eventId){
                return list[i];
            }
        }
        list = SearchManager.results;
        for(var i in list){
            if(list[i].eventId == eventId){
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
        //console.log(data);
        console.log("pivot successful");
		if(data=="Bad User"){ alert(data); return; }
		var obj = JSON.parse(data);
		//var arr = createItemsArray(obj);
		var arr = createItemsArray(obj, time*1000-43200000); // FIXME remove the startTime filtering (should be done in server)
		GraphManager.startLoadingData(time*1000-43200000, time*1000+43199999); //FIXME load from server
		ItemManager.clear();
		ItemManager.addItems(arr); // ItemManager loads data to GraphManager
        GraphManager.finishLoadingData(range[0], range[1]);
		Helper.hideLoading();
        $(window).trigger("pivot");
	}

    var errorMessage = "Error loading information. Please make sure the background daemon is running and try again. ";
    var youpivotdisabled = "In the current Alpha Release, YouPivot is not enabled. This feature will be enabled when the server binary is completed. Please check for updates regularly. This functionality will be integrated by the Beta release.";
    var errorIcon = "<div id='errorIcon' />";
	// Displays an error message if the server cannot be connected
	function pivotOnError(response){
        $("#y-spinner").hide();
		$("#blocker").html("<div class='errorMessage' style='text-align: middle; position: relative; top: 100px;'>"
                + errorIcon + "<br />" + youpivotdisabled + "</div>")
            .css("background-color", "rgba(180, 180, 180, 0.7)").css("cursor", "default");
	}

    // FIXME remove the startTime filtering (should be done in server)
	function createItemsArray(obj, startTime){
		var output = [];
        var k=0;
		for(var i in obj.rows){
			output[k] = Translator.translateItem(obj.rows[i].value);
            if(output[k].endTime >= startTime) k++; // accept the item only if it ends after our display startTime
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
