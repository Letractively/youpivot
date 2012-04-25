include_("URLHash");
include_("Connector");
include_("analytics");
include_("Helper");
include_("GraphManager");
include_("Translator");
include_("HighlightManager");

var PivotManager = new (function _PivotManager(){
    var self = this;

	var pivotInterval = pref("pivotInterval");
    self.pivoting = false;

    self.init = function(){
        $("#graphMoveLeft").click(function(){
            self.pageFlip(-1);
        });
        $("#graphMoveRight").click(function(){
            self.pageFlip(1);
        });
        URLHash.onHashValueChange("pivot", function(time){
            self.pivot(time, {"forceReload": false});
        });
        URLHash.onHashValueChange("pivotitem", function(item){
            self.pivotItem(item);
        });
    }

	self.pivotItem = function(eventId){
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
		self.pivot(pivotTime, {"forceReload": false, "callback": function(){
			HighlightManager.clearHighlight();
            var id = ItemManager.getItemByEventId(item.eventId).id;
            HighlightManager.clickOnGraph(id);
		}, "selection": [item.startTime, item.endTime]});
        analytics("YouPivot", "Pivot on item: "+item.url, {action: "pivot", action2: "pivot on item", url: item.url, eventId: eventId});
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

	self.pivotUrl = function(time){
        self.pivotItem(item);
        URLHash.setHash("pivot", time);
	}

	self.pivot = function(time, options){
		//extract options
        self.pivoting = true;
		var callback = Helper.getOptions(options, "callback", function(){});
		var forceReload = Helper.getOptions(options, "forceReload", true);
		var selection = Helper.getOptions(options, "selection", [time-pivotInterval/2, time+pivotInterval/2]);

		//FilterManager.filter.clearFilters();
		SearchManager.antiSearch();
		var range = GraphManager.getLoadedRange();
		var midPoint = (range.start+range.end)/2;
		if(Math.abs(time-midPoint)>(range.end-range.start)/4 || forceReload){
			pivotServer(time, selection, callback);
		}else{
            analytics("YouPivot", "Pivot: " + new Date(selection[0]) + " - " + new Date(selection[1]) + " (no update needed)", {action: "pivot", update: false, startRange: new Date(selection[0]), endRange: new Date(selection[1])});
			GraphManager.setDisplayRange(selection[0], selection[1]);
			callback();
            $(window).trigger("pivot");
		}
	}

	self.pivotRange = function(startRange, endRange){
		console.log("pivot range is not yet implemented");
		console.log(startRange +" ::: "+ endRange);
	}

	self.pageFlip = function(direction){
		//FIXME use pivotRange should be better
        if(self.pivoting)
            return;
		var range = GraphManager.getLoadedRange();
		var midpoint = Math.floor((range.end+range.start)/2);
		if(direction>0){
			self.pivot(midpoint+pref("pageFlipRange"), {"forceReload": true});
		}else{
			self.pivot(midpoint-pref("pageFlipRange"), {"forceReload": true});
		}
	}

	function pivotServer(time, range, callback){
		Helper.showLoading();
		time = Math.floor(time/1000);
        analytics("YouPivot", "Pivot: " + new Date(time) + " (ping server)", {action: "pivot", update: true, pivotTime: new Date(time)});
		Connector.send("get", {pivottime: time}, {onSuccess: function(data){
            console.log("success");
            self.pivoting = false;
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
    var youpivotdisabled = "<font style='font-size: 20px'>YouPivot is unable to connect to the local server. </font><p>You need to install / run it before you can access YouPivot history. <br /> Download the server at <a href='http://youpivot.com/downloads/#getFull' target='installyoupivot'>http://youpivot.com/downloads</a></p>";
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
		for(var i=0; i<obj.rows.length; i++){
			output[k] = Translator.translateItem(obj.rows[i].value);
            if(output[k].endTime >= startTime) k++; // accept the item only if it ends after our display startTime
		}
		return output;
	}

})();
