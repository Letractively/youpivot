var GraphManager = {};

(function(){
	var m = GraphManager;

	var startTime = new Date().getTime()-24*60*60*1000;
	var endTime = new Date().getTime();
	var dataArray = new Array();
	var topGraph;
	var steamGraph;

	$(function(){
		loadTime(0, 1);
		loadDate();
	});

	m.getStartTime = function(){
		return startTime;
	}

	m.getEndTime = function(){
		return endTime;
	}

	m.setTime = function(st, et){
		throw "Debug me first";
		startTime = st;
		endTime = et;
		loadTime();
		loadDate();
	}

	m.addLayer = function(color, arr, id){
		dataArray[dataArray.length] = {data: arr, color: color, id: id, active: false, highlight: false};
	}

	m.highlightLayer = function(id, persistent){
		var index = getLayerIndex(id);
		if(!index) return;
		dataArray[index].active = true;
		if(persistent) dataArray[index].highlight = true;
		steamGraph.render();
	}

	m.lowlightLayer = function(id, clearPersistent){
		var index = getLayerIndex(id);
		if(!index) return;
		if(clearPersistent || !dataArray[index].highlight){
			dataArray[index].active = false;
			dataArray[index].highlight = false;
		}
		steamGraph.render();
	}

	function getLayerIndex(id){
		for(var i in dataArray){
			if(dataArray[i].id === id){
				return i;
			}
		}
		return false;
	}

	function loadTime(offset, scale){
		var w = endTime-startTime;
		$("#graphDate .left").text(Helper.formatTime(offset*w + startTime, 12));
		$("#graphDate .right").text(Helper.formatTime((offset+scale)*w + startTime, 12));
	}

	function loadDate(){
		var string = Helper.formatDate(startTime);
		$("#topGraphDate").text(string);
	}

	//deprecated
	var maxArrLength = 758;
	function scaleArray(arr, st){
		var nArr = new Array();
		var n = (startTime-st)/114000;
		for(var i=0; i<n; i++){
			nArr.shift();
		}
		n *= -1;
		for(var i=0; i<n; i++){
			nArr[i] = 0;
		}
		for(var i=0; i<arr.length; i++){
			if(nArr.length>maxArrLength){
				console.log("exceeds max length");
				break;
			}
			nArr[nArr.length] = arr[i];
		}
		return arr;
	}

	m.renderTopGraph = function(){
		topGraph.render();
	}

	m.drawTopGraph = function(){
		//generate test data
		var data = pv.range(0, 100, .1).map(function(x) {
			return {x: x, y: Math.abs(Math.sin(x/2), 2)/2+Math.random()};
		});

		var box = $("#topGraph");

		var w = 680,
			h = box.height(),
			x = pv.Scale.linear(0, 100).range(0, w),
			y = pv.Scale.linear(0, 2).range(0, h);

		topGraph = new pv.Panel()
			.canvas("topGraph")
			.width(w)
			.height(h);

		topGraph.add(pv.Bar)
			.data(data)
			.bottom(0)
			.left(function(d){ return x(d.x)})
			.width(w/1000)
			.height(function(d){ return y(d.y); })
			.fillStyle("rgb(176,196,222)")
			//.strokeStyle("rgba(200, 200, 200, 100)")
			.lineWidth(0);


		var dragged = false;
		var hilight = {x: 200, dx: 100};
		topGraph.add(pv.Panel)
			.data([hilight])
			.cursor("crosshair")
			.events("all")
			.event("mousedown", pv.Behavior.select())
			.event("select", function(d){ dragged = true; scaleToSection(d.x/w, d.dx/w); })
			.event("selectend", function(d){
				if(dragged){
				   dragged = false; 
				}else{
					d.x -= 50; 
					if(d.x<0) d.x = 0;
					if(d.x>w-100) d.x = w-100;
					d.dx = 100;
					scaleToSection(d.x/w, d.dx/w);
					return this; 
				}
			})
		.add(pv.Bar)
			.left(function(d){ return d.x })
			.top(1)
			.width(function(d){ return d.dx})
			.height(h-2)
			.fillStyle("rgba(128, 128, 128, 0.15)")
			.strokeStyle("rgba(128, 128, 128, 0.8)")
			.lineWidth(1)
			.cursor("move")
			.event("mousedown", pv.Behavior.drag())
			.event("drag", function(d){ dragged = true; scaleToSection(d.x/w, d.dx/w); })
			.event("dragend", function(d){
				if(dragged){
					dragged = false;
				}else{
					d.x = this.mouse().x-50;
					if(d.x<0) d.x = 0;
					if(d.x>w-100) d.x = w-100;
					d.dx = 100;
					scaleToSection(d.x/w, d.dx/w);
					return this;
				}
			})

		topGraph.render();

	}

	function scale(num, max){
		return num/max;
	}

	function scaleToSection(offset, cap){
		xScale = 0.1/cap; //0.1 is the smallest value coz the graph is rendered at 10x width
		$("#steamGraph svg").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*width)+"px)");
		$("#events").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*width)+"px)");
		$(".eventIcon").css("-webkit-transform", "scaleX("+1/xScale+")");
		//reload the time label on top of the steamGraph
		loadTime(offset, cap);
	}

	m.renderSteamGraph = function(){
		steamGraph.render();
	}

	var width;
	m.drawSteamGraph = function(){
		var data = dataArray;
		var sgbox = $("#steamGraph");
		sgbox.width(sgbox.width()); //Hack to make it not expand itself because the content is big - translating CSS 100% width to pixels for the system
		width = sgbox.width()*10;
		var height = sgbox.height();
		var max = getMaxFromSteam(data);
		
		var x = pv.Scale.linear(0, 758).range(0, width),
			y = pv.Scale.linear(0, max*1.1).range(0, height);
		steamGraph = new pv.Panel()
			.canvas("steamGraph")
			.width(width)
			.height(height)
		steamGraph.add(pv.Layout.Stack)
			.layers(data)
			.values(function(d){ return data[this.index].data; })
			.order("inside-out")
			.offset("silohouette")
			.x(function(d, p){ return x(this.index) })
			.y(y)
			.layer.add(pv.Area)
			.def("active", false)
			.fillStyle(function(d, p){ 
				return (p.active || p.highlight) ? p.color : Helper.createLighterColor(p.color, 1); })
			.lineWidth(2)
			.event("mouseover", function(d, p){ highlightItem(p.id, false); p.active = true; return this; })
			.event("mouseout", function(d, p){ lowlightItem(p.id, false); p.active = false; return this; })
			.event("click", function(d, p){ p.highlight = !p.highlight; toggleItemHighlight(p.id, p.highlight); return this; });
		steamGraph.render();
	}

	function highlightItem(id, persistent){
		HighlightManager.highlightDomain(id, persistent);
	}

	function lowlightItem(id, clearPersistent){
		HighlightManager.lowlightDomain(id, clearPersistent);
	}

	function toggleItemHighlight(id, toggle){
		if(toggle)
			highlightItem(id, true);
		else
			lowlightItem(id, true);
	}

	function getMaxFromSteam(data){
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
