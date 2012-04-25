include_("jQuery_rotate");
include_("DateFormatter");
include_("PrefManager");

include_("Helper");
include_("Color");

include_("FilterTimeManager");
include_("ShadowManager");
include_("TopGraph");
include_("StreamGraph");
include_("EventManager");
include_("HighlightManager");
//include_("PivotManager");

var GraphManager = new (function _GraphManager(){
	var self = this;

	var startTime = -86400000; // meaningless initialization value (for easier debugging)
	var endTime = -1;
	var dataArray = new Array(); //array of the data for the graph (importance values)

	var maxArrLength = 758; // 758 = 86400 / 114

	var displayRange = {offset: 0, scale: 0}; // {offset, scale}
	var width = 680; //width of the graphs

    /************** init *************/

    self.init = function(){
		refreshTimeDisplay([startTime, endTime]);
		refreshDateDisplay();
        self.addCollapseGraphBtn();
        $("#y-searchResults").bind("search", function(e, active){
            if(active){
                dimGraphs(false);
            }else{
                dimGraphs(true);
            }
        });
        TopGraph.init(width);
        handleTopGraphEvents();

        StreamGraph.init();
        handleStreamGraphEvents();
	}

    /************* mouse events re-routing ************/

    function handleTopGraphEvents(){
        TopGraph.onSelectionStart(function(startPos){
            startSelection();
        });
        TopGraph.onSelectionEnd(function(startPos, currentPos){
            finishSelection();
        });
        TopGraph.onSelectionMove(function(startPos, currentPos){
            setSelection(currentPos.offset, currentPos.scale, true);
        });
        TopGraph.onSelectionEdge(function(direction){
            if(direction == "left"){
                PivotManager.pageFlip(-1);
            }else if(direction == "right"){
                PivotManager.pageFlip(1);
            }
        });
    }

    function handleStreamGraphEvents(){
        StreamGraph.onMouseEnterLayer(HighlightManager.mouseEnterGraph);
        StreamGraph.onMouseLeaveLayer(HighlightManager.mouseLeaveGraph);
        StreamGraph.onMouseClickLayer(HighlightManager.clickOnGraph);
    }

    self.addCollapseGraphBtn = function(){
        var btn = $("<div />").attr("id", "collapseGraph");
        $("#graphInfo").append(btn);
        btn.click(function(){
            toggleGraph();
            return false;
        });
    }

	function dimGraphs(enable){
		$("#visualGraphs").css("pointer-events", (enable) ? "auto" : "none");
		$("#visualGraphs>div").css("opacity", (enable) ? "1" : "0.4");
		$("#topBackground").css("z-index", (enable) ? 0 : 10);
	}

    /************* display range handling *************/

	self.getDisplayRange = function(){
        // possibly unused
		return displayRange;
	}

	self.getLoadedRange = function(){
		return {start: startTime, end: endTime};
	}

	self.setDisplayRange = function(startTime, endTime){
		var scale = getTimeScale(startTime, endTime);
		setSelectionScale(scale[0], scale[1], true);
        finishSelection();
	}

    function setDisplayRangeWithoutRedraw(startTime, endTime){
		var scale = getTimeScale(startTime, endTime);
		setSelectionScale(scale[0], scale[1], false);
    }

	function setSelectionScale(offset, cap, redraw){
        // integrity check
		if(offset<0){
		   cap += offset; 
		   offset = 0;
		}
		if(offset>1) offset = 1;
		if(offset + cap > 1){
			cap = 1-offset;
		}
        if(redraw === undefined)
            redraw = true;

        // real work
		TopGraph.setSelection(offset, cap);
		setSelection(offset, cap, redraw);
	}

	function setSelection(offset, cap, redraw){
		displayRange = {offset: offset, scale: cap};
        if(redraw){
            StreamGraph.scale(offset, cap);
        }

        // scale the single event icons
		xScale = 0.1/cap; //0.1 is the smallest value coz the graph is rendered at 10x width
		$("#events").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*width*10)+"px)");
		EventManager.scaleIcons(displayRange);
		//reload the time label on top of the streamGraph
		var time = getScaleTime(offset, cap);
		refreshTimeDisplay(time);
		FilterTimeManager.filterTime(time);
		$("#visualGraphs").trigger("setselection");
	}

    function startSelection(){
		//$("#textContent .item_date span").removeClass("hidden").addClass("grey");
	}

    function finishSelection(){
		//$("#textContent .item_date span").removeClass("grey");
        TableManager.refreshTopRows();
	}

    /************ graph data handling ************/

    self.addEvent = function(startTime, favUrl, color, title, id){
        EventManager.add(startTime, favUrl, color, title, id, self.getLoadedRange(), displayRange);
    }

	self.startLoadingData = function(_startTime, _endTime){
        dataArray = [];
        startTime = _startTime;
        endTime = _endTime;
		refreshTimeDisplay([startTime, endTime]);
		refreshDateDisplay();
	}

	self.loadData = function(color, arr, id, startTime, domain){
        var offset = getArrayOffset(startTime);
        if(offset+arr.length >= 0 && offset < maxArrLength)
            dataArray[dataArray.length] = {offset: offset, array: arr, color: color, id: id, domain: domain};
	}

	self.clear = function(){
		dataArray = [];
        EventManager.clear();
	}

    self.finishLoadingData = function(displayRangeStart, displayRangeEnd){
        setDisplayRangeWithoutRedraw(displayRangeStart, displayRangeEnd);
        self.draw();
    }

    /************* misc ******************/

	self.draw = function(){
                                            var ttt = new Date().getTime(); // debug
                                            console.log("Start drawing graphs"); // debug
        var totalArray = getTotalArrayAndCalculateDomainData(dataArray);
		TopGraph.draw(totalArray, getMaxData(totalArray), displayRange);
                                            console.log("Top graph drawn: ", new Date().getTime() - ttt); // debug
                                            ttt = new Date().getTime();
		StreamGraph.draw(dataArray, displayRange.offset, displayRange.scale);
                                            console.log("Stream graph drawn: ", new Date().getTime() - ttt); // debug
	}

    self.drawTopGraph = function(){
        var totalArray = getTotalArrayAndCalculateDomainData(dataArray);
        TopGraph.draw(dataArray, getMaxData(totalArray));
    }

    function getDataIndex(id){
		for(var i in dataArray){
			if(dataArray[i].id === id){
				return i;
			}
		}
		return false;
    }

	self.highlightLayer = function(id, persistent){
		var index = getDataIndex(id);
		if(!index) return;

        var color = ItemManager.getItem(id).domain.color;
		color = Helper.createLighterColor(color, PrefManager.getOption("highlightGraph"), "array");
        StreamGraph.changeColor(id, color);
		highlightTopGraph(index, Color.toRGBString(color));
	}

	function highlightTopGraph(index, color){
		var arr = (index==-1) ? [] : accumulate(dataArray[index].id);
		TopGraph.drawHighlight(arr, color);
	}

	function accumulate(id){
        var domain = ItemManager.getDomain(id);
        var output = domain.data;
        if(!output)
            output = [];
		return output;
	}

	self.lowlightLayer = function(id, clearPersistent){
        var color = ItemManager.getDomain(id).graphColor;
		//color = Helper.createLighterColor(color, PrefManager.getOption("normalGraph"));
        StreamGraph.changeColor(id, color);
        highlightTopGraph(-1);
	}

	//toggle the visibility of the graph
	function toggleGraph(){
        console.log("toggle graph");
		var hiding = $("#eventsWrap").is(":visible");
		$("#graphDate div").width((hiding) ? "auto" : "50%");
		$("#graphDate .dash").toggleClass("hidden");
		$("#eventsWrap").toggle();
		$("#collapseGraph").animate({"rotate": (hiding) ? 180 : 0}, 150);
		ShadowManager.animate( (hiding ? 83 : 270) , 200);
		$("#streamGraph").animate({height: (hiding) ? 0 : 150}, 200); //block display to prevent it from occupying an extra row
	}

	function getScaleTime(offset, scale){
		var w = endTime-startTime;
		var st = offset*w + startTime;
		var et = (offset+scale)*w + startTime;
		return [st, et];
	}

	//the reverse of getScaleTime
	function getTimeScale(st, et){
		var w = endTime-startTime;
		var offset = (st - startTime)/w;
		var scale = (et - startTime)/w - offset;
		return [offset, scale];
	}

	function refreshTimeDisplay(time){
		$("#startDate").text(DateFormatter.formatTime(time[0], 12));
		$("#endDate").text(DateFormatter.formatTime(time[1], 12));
	}

	function refreshDateDisplay(){
        DateBoxController.setDate(startTime, endTime);

		var midnight = new Date(endTime);
		midnight.setHours(0); midnight.setMinutes(0); midnight.setSeconds(0);
		var scale = getTimeScale(midnight.getTime(), midnight.getTime()+1);
		$("#topGraph").css("background-position", (scale[0]-0.5)*GraphManager.width);
	}


    function getArrayOffset(itemStartTime){
		var offset = Math.floor((itemStartTime-startTime)/114000);
        return offset;
    }

    function getTotalArrayAndCalculateDomainData(dataArray){
        var allzero = [];
        for(var i=0; i<maxArrLength; i++){
            allzero[i] = 0;
        }
        output = allzero.slice(0);
        for(var i in dataArray){
            var domain = ItemManager.getDomain(dataArray[i].id); // domain
            var domainArray = (domain.data) ? domain.data : allzero.slice(0);

            var data = dataArray[i].array;
            var offset = dataArray[i].offset;
            for(var j=0; j<data.length; j++){
                output[j+offset] += data[j];
                domainArray[j+offset] += data[j]; // domain
            }

            domain.data = domainArray; // domain
        }
        return output;
    }

	function getMaxData(array){
        var max = 0;
        for(var i=0; i<array.length; i++){
            if(array[i] > max)
                max = array[i];
        }
        return max;
	}
})();
