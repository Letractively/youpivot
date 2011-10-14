include("youpivot/js/history/filtertime.js");

var GraphManager = {};

(function(){
	var m = GraphManager;

	var startTime = -86400000; // meaningless initialization value (for easier debugging)
	var endTime = -1;
	var dataArray = new Array(); //array of the data for the graph (importance values)

	var graphPos = {offset: 0, scale: 0}; // {offset, scale}
	m.width = 680; //width of the graphs

	$(function(){
		loadTime([startTime, endTime]);
		loadDate();
        m.addCollapseGraphBtn();
        $("#y-searchResults").bind("search", function(e, active){
            if(active){
                dimGraphs(false);
            }else{
                dimGraphs(true);
            }
        });
	});

    m.addCollapseGraphBtn = function(){
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

	m.getGraphPos = function(){
		return graphPos;
	}
	m.getRange = function(){
		return {start: startTime, end: endTime};
	}
	m.setRange = function(times){
		startTime = times[0];
		endTime = times[1];
		loadTime(times);
		loadDate();
		TopGraph.setSelection(0, 1);
		setSelection(0,1);
	}

	m.addLayer = function(color, arr, id, startTime, domain){
		var dat = createDataArray(startTime, arr);
		//console.log(dat.length);
		dataArray[dataArray.length] = {data: dat, color: color, id: id, domain: domain, highlight: 0};
        return dat;
	}
	m.clear = function(){
		dataArray = [];
	}

    m.drawStreamGraphWithUpdatedScale = function(){
		StreamGraph.drawWithScale(dataArray, graphPos.offset, graphPos.scale);
    }

    m.giveDataToStreamGraph = function(){
        StreamGraph.provideData(dataArray);
    }

	m.draw = function(){
        var ttt = new Date().getTime(); // debug
        console.log("Start drawing graphs"); // debug
		TopGraph.draw(dataArray, getMaxData(dataArray));
        console.log("Top graph drawn: ", new Date().getTime() - ttt); // debug
        ttt = new Date().getTime();
		StreamGraph.draw(dataArray);
        console.log("Stream graph drawn: ", new Date().getTime() - ttt); // debug
	}

    m.drawTopGraph = function(){
        TopGraph.draw(dataArray, getMaxData(dataArray));
    }

    m.redrawStreamGraph = function(){
        StreamGraph.render();
    }

	m.setSelection = function(startTime, endTime, redraw){
		var scale = getTimeScale(startTime, endTime);
		m.setSelectionScale(scale[0], scale[1], redraw);
	}

	m.setSelectionScale = function(offset, cap, redraw){
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

	// same as setSelection, but using 0-1 scale instead of time as variable
	// called by changing topGraph
	m.topGraphCallScale = function(offset, cap){
		setSelection(offset, cap, true);
	}

	m.getDataArray = function(){
		return dataArray;
	}
	m.getData = function(i){
		return dataArray[i];
	}
	m.getDataIndex = function(id){
		for(var i in dataArray){
			if(dataArray[i].id === id){
				return i;
			}
		}
		return false;
	}

	m.highlightLayer = function(id, persistent){
		var index = m.getDataIndex(id);
		if(!index) return;

		var color = Helper.createLighterColor(dataArray[index].color, PrefManager.getOption("highlightGraph"));
        StreamGraph.highlightLayer(id);
		m.highlightTopGraph(index, color);
	}

	m.highlightTopGraph = function(index, color){
		var arr = (index==-1) ? [] : accumulate(dataArray[index].id);
		TopGraph.highlight(arr, color);
	}

	function accumulate(id){
        var domain = ItemManager.getDomain(id);
        var output = domain.data;
        if(!output)
            output = [];
		return output;
	}

	m.lowlightLayer = function(id, clearPersistent){
		var index = GraphManager.getDataIndex(id);
		if(!index) return;
        StreamGraph.lowlightLayer(id);
        m.highlightTopGraph(-1);
	}

	//toggle the visibility of the graph
	function toggleGraph(){
        console.log("hide");
		var hiding = $("#eventsWrap").is(":visible");
		$("#graphDate div").width((hiding) ? "auto" : "50%");
		$("#graphDate .dash").toggle();
		$("#eventsWrap").toggle();
		$("#collapseGraph").animate({"rotate": (hiding) ? 180 : 0}, 150);
		ShadowManager.animate((hiding) ? 83 : 270, 200);
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

	function loadTime(time){
		$("#startDate").text(Helper.formatTime(time[0], 12));
		$("#endDate").text(Helper.formatTime(time[1], 12));
	}

	function loadDate(){
		var string = Helper.formatDate(startTime);
		$("#topGraphDate").text(string);
		var midnight = new Date(endTime);
		midnight.setHours(0); midnight.setMinutes(0); midnight.setSeconds(0);
		var scale = getTimeScale(midnight.getTime(), midnight.getTime()+1);
		$("#topGraph").css("background-position", (scale[0]-0.5)*GraphManager.width);
	}

	function scale(num, max){
		return num/max;
	}

	function setSelection(offset, cap, redraw){
		graphPos = {offset: offset, scale: cap};
        if(redraw){
            StreamGraph.scale(offset, cap);
        }

        // scale the single event icons
		xScale = 0.1/cap; //0.1 is the smallest value coz the graph is rendered at 10x width
		$("#events").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*m.width*10)+"px)");
		EventManager.scaleIcons(graphPos);
		//reload the time label on top of the streamGraph
		var time = getScaleTime(offset, cap);
		loadTime(time);
		FilterTimeManager.filterTime(time);
		$("#visualGraphs").trigger("setselection");
	}

	m.startSelection = function(){
		$("#textContent .item_date span").removeClass("hidden").addClass("grey");
	}

	m.finishSelection = function(){
		$("#textContent .item_date span").removeClass("grey");
		$("#textContent").itemTable("refreshTopRows");
	}

    // TODO: use object to make fewer 0 value in arrays
	var maxArrLength = 758; // 758 = 86400 / 114
	function createDataArray(itemStartTime, arr){
		var output = [];
		var offset = Math.floor((itemStartTime-startTime)/114000);
		for(var i=0; i<maxArrLength; i++){
			var index = i-offset;
			output[i] = (index>=0 && index<arr.length) ? arr[index] : 0;
		}
		return output;
	}

	function getMaxData(data){
		if(data.length==0) return 0;
		var length = data[0].data.length;
		var max = 0;
		for(var j=0; j<length; j++){
			var sum = 0;
			for(var i in data){
				sum += data[i].data[j];
			}
			if(sum>max) max = sum;
		}
		return max;
	}
})();