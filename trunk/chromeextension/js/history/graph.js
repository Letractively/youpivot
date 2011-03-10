var GraphManager = {};

(function(){
	var m = GraphManager;

	var startTime = -2;
	var endTime = -1;
	var dataArray = new Array(); //array of the data for the graph (importance values)

	var graphPos = {offset: 0, scale: 1}; // {offset, scale}
	m.width = 680; //width of the graphs

	$(function(){
		loadTime([startTime, endTime]);
		loadDate();
	});
	$("#collapseGraph").click(function(){
		toggleGraph();
		return false;
	});

	m.getGraphPos = function(){
		return graphPos;
	}
	m.getRange = function(){
		return {start: startTime, end: endTime};
	}

	m.addLayer = function(color, arr, id, startTime){
		var dat = createDataArray(startTime, arr);
		dataArray[dataArray.length] = {data: dat, color: color, id: id, active: false, highlight: false};
	}
	m.clear = function(){
		dataArray = [];
	}

	m.draw = function(){
		TopGraph.draw(dataArray, getMaxData(dataArray));
		StreamGraph.draw(dataArray, getMaxData(dataArray));
	}

	m.setSelection = function(startTime, endTime){
		var scale = getTimeScale();
		TopGraph.setSelection(scale[0], scale[1]);
		setSelection(scale[0], scale[1]);
	}

	// same as setSelection, but using 0-1 scale instead of time as variable
	// called by changing topGraph
	m.setSelectionScale = function(offset, cap){
		setSelection(offset, cap);
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

	//toggle the visibility of the graph
	function toggleGraph(){
		var hiding = $("#graphDate").is(":visible");
		$("#graphDate").toggle();
		$("#eventsWrap").toggle();
		$("#collapseGraph").animate({"rotate": (hiding) ? 180 : 0}, 150);
		$("#graphShadow").animate({height: (hiding) ? 83 : 270}, 200);
		$("#steamGraph").slideToggle(200, function(){
			ShadowManager.refresh();
		});
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
		$("#graphDate .left").text(Helper.formatTime(time[0], 12));
		$("#graphDate .right").text(Helper.formatTime(time[1], 12));
	}

	function loadDate(){
		var string = Helper.formatDate(startTime);
		$("#topGraphDate").text(string);
	}

	function scale(num, max){
		return num/max;
	}

	function setSelection(offset, cap){
		graphPos = {offset: offset, scale: cap};
		xScale = 0.1/cap; //0.1 is the smallest value coz the graph is rendered at 10x width
		StreamGraph.scale(xScale, offset, m.width*10);
		$("#events").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*m.width*10)+"px)");
		EventManager.scaleIcons(graphPos);
		//reload the time label on top of the steamGraph
		var time = getScaleTime(offset, cap);
		loadTime(time);
		FilterManager.filterTime(time);
	}

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
