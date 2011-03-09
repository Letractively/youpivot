var GraphManager = {};

(function(){
	var m = GraphManager;

	var startTime = new Date().getTime()-24*60*60*1000;
	var endTime = new Date().getTime();
	var dataArray = new Array(); //array of the data for the graph (importance values)
	var topGraph;
	var steamGraph;
	var elements = {}; //DOM objects of the streamGraph layers

	var graphPos = {offset: 0, scale: 1}; // {offset, scale}

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

	m.getStartTime = function(){
		return startTime;
	}
	m.getEndTime = function(){
		return endTime;
	}

	m.addLayer = function(color, arr, id, startTime){
		var dat = createDataArray(startTime, arr);
		dataArray[dataArray.length] = {data: dat, color: color, id: id, active: false, highlight: false};
	}

	m.clear = function(){
		dataArray = [];
	}

	m.draw = function(){
		m.drawTopGraph();
		m.drawSteamGraph();
	}

	m.highlightLayer = function(id, persistent){
		var index = getLayerIndex(id);
		if(!index) return;
		dataArray[index].active = true;
		if(persistent) dataArray[index].highlight = true;
		//directly change the object in DOM rather than re-render to improve performance (significantly)
		var color = dataArray[index].color;
		elements[id].attr("fill", color);

		m.highlightTop(index);
	}

	m.lowlightLayer = function(id, clearPersistent){
		var index = getLayerIndex(id);
		if(!index) return;
		if(clearPersistent || !dataArray[index].highlight){
			dataArray[index].active = false;
			dataArray[index].highlight = false;
			//directly change the object in DOM rather than re-render to improve performance (significantly)
			var color = Helper.createLighterColor(dataArray[index].color, 1);
			elements[id].attr("fill", color);
			m.highlightTop(-1);
		}
	}

	function getLayerIndex(id){
		for(var i in dataArray){
			if(dataArray[i].id === id){
				return i;
			}
		}
		return false;
	}

	function getScaleTime(offset, scale){
		var w = endTime-startTime;
		var st = offset*w + startTime;
		var et = (offset+scale)*w + startTime;
		return [st, et];
	}

	function loadTime(time){
		$("#graphDate .left").text(Helper.formatTime(time[0], 12));
		$("#graphDate .right").text(Helper.formatTime(time[1], 12));
	}

	function loadDate(){
		var string = Helper.formatDate(startTime);
		$("#topGraphDate").text(string);
	}

	m.renderTopGraph = function(){
		topGraph.render();
	}

	function addImportance(index){
		var output = 0;
		for(var i in dataArray){
			output += dataArray[i].data[index];
		}
		return output;
	}

	m.highlightTop = function(i){
		var data = (i==-1) ? [] : dataArray[i].data;
		topHighlight.children[0].data(data);
		topHighlight.render();
	}

	var topHighlight;
	m.drawTopGraph = function(){
		var data = pv.range(0, 758, 1).map(function(x) {
			return {x: x, y: addImportance(x)};
		});

		var box = $("#topGraph");

		var max = getMaxFromSteam(dataArray);

		var w = 680,
			h = box.height(),
			x = pv.Scale.linear(0, 758).range(0, w),
			y = pv.Scale.linear(0, max).range(0, h);

		topGraph = new pv.Panel()
			.canvas("topGraph")
			.width(w)
			.height(h);

		var core = topGraph.add(pv.Panel);
		core.add(pv.Area)
			.data(data)
			.bottom(0)
			.left(function(d){ return x(d.x); })
			.height(function(d){ return y(d.y); })
			.fillStyle("rgb(176,196,222)")

		topHighlight = topGraph.add(pv.Panel);
		topHighlight.add(pv.Area)
			.data([])
			.bottom(0)
			.left(function(d){ return x(this.index); })
			.height(function(d){ return y(d); })
			.fillStyle("rgb(130,140,255)")

		var dragged = false;
		var hilight = {x: (graphPos.offset*w), dx: (graphPos.scale*w)};
		core.add(pv.Panel)
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
			.top(0)
			.width(function(d){ return d.dx})
			.height(h)
			.fillStyle("rgba(128, 128, 128, 0.15)")
			//.strokeStyle("rgba(128, 128, 128, 0.8)")
			//.lineWidth(0)
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
		graphPos = {offset: offset, scale: cap};
		xScale = 0.1/cap; //0.1 is the smallest value coz the graph is rendered at 10x width
		$("#steamGraph svg").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*width)+"px)");
		$("#events").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*width)+"px)");
		EventManager.scaleIcons(graphPos);
		//reload the time label on top of the steamGraph
		var time = getScaleTime(offset, cap);
		loadTime(time);
		FilterManager.filterTime(time);
	}

	m.renderSteamGraph = function(){
		console.log("re-rendering streamGraph");
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
		var stack = steamGraph.add(pv.Layout.Stack)
			.layers(data)
			.values(function(d){ return data[this.index].data; })
			.order("inside-out")
			.offset("silohouette")
			.x(function(d){ return x(this.index) })
			.y(y)
			.layer.add(pv.Area)
			.title(function(d, p){ return "layer-"+p.id; })
			.fillStyle(function(d, p){ 
				return (p.active || p.highlight) ? p.color : Helper.createLighterColor(p.color, 1); })
			.lineWidth(2)
			.event("mouseover", function(d, p){
			   	this.title(""); //destroy the title used for DOM extraction
				highlightItem(p.id, false); 
				p.active = true; 
				return this; })
			.event("mouseout", function(d, p){ 
				lowlightItem(p.id, false); 
				p.active = false; 
				return this; })
			.event("click", function(d, p){ 
			  	p.highlight = !p.highlight; 
				toggleItemHighlight(p.id, p.highlight); 
				return this; });

		steamGraph.render();
		saveElements();
	}

	function saveElements(){
		$('#steamGraph g>a').each(function(){
			var title = $(this).attr("title");
			title.match(/^layer-(\d+)$/);
			var id = RegExp.$1;
			elements[id] = $(this).find("path");
		});
	}

	function highlightItem(id, persistent){
		HighlightManager.highlightDomain(id, persistent);
		HighlightManager.scrollToItem(id, (persistent) ? 0 : 500);
		m.highlightTop(getLayerIndex(id)); //highlight the corresponding sections of the topGraph
	}

	function lowlightItem(id, clearPersistent){
		HighlightManager.cancelScroll(id); 
		HighlightManager.lowlightDomain(id, clearPersistent);
		m.highlightTop(-1); //cancel highlight on the topGraph
	}

	function toggleItemHighlight(id, toggle){
		if(toggle)
			highlightItem(id, true);
		else
			lowlightItem(id, true);
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
