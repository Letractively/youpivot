var StreamGraph = {};

(function(){
	m = StreamGraph;

	var width;
	var elements = {}; //DOM objects of the streamGraph layers
	var graphHeight = 1;

	m.changeColor = function(id, color){
		//directly change the object in DOM rather than re-render to improve performance (significantly)
		elements[id].attr("fill", color);
	}

	m.render = function(){
		console.log("re-rendering streamGraph");
		m.obj.render();
	}

	m.draw = function(data, max){
		graphHeight = max;
		var sgbox = $("#streamGraph");
		//sgbox.width(sgbox.width()); //Hack to make it not expand itself because the content is big - translating CSS 100% width to pixels for the system
		var w = GraphManager.width*10,
			h = sgbox.height(),
			x = pv.Scale.linear(0, 758).range(0, w),
			y = pv.Scale.linear(0, max*1.1).range(0, h);
		var streamGraph = new pv.Panel()
			.canvas("streamGraph")
			.width(w)
			.height(h)
			.add(pv.Layout.Stack)
			.layers(data)
			.values(function(d){ return data[this.index].data; })
			.order("reverse")
			.offset("silohouette")
			.x(function(d){ return x(this.index) })
			.y(y)
			.layer.add(pv.Area)
			.interpolate("cardinal")
			.title(function(d, p){ return "layer-"+p.id; })
			.fillStyle(function(d, p){ 
				return (p.active || p.highlight) ? p.color : Helper.createLighterColor(p.color, "high"); })
			.lineWidth(2)
			.event("mouseover", function(d, p){
			   	this.title(""); //destroy the title used for DOM extraction
				highlightItem(p.id, false); 
				})
			.event("mouseout", function(d, p){ 
				lowlightItem(p.id, false); 
				})
			.event("click", function(d, p){ 
			  	p.highlight = !p.highlight; 
				toggleItemHighlight(p.id, p.highlight); 
			});

		streamGraph.render();
		m.obj = streamGraph;
		saveElements();
		$("#streamGraph").css("display", "block");
	}

	m.scale = function(scale, offset, width){
		var yScale = getYScale();
		var lastTransform = "scaleY("+yScale+") scaleX("+scale+") translateX("+(-offset*width)+"px)";
		$("#streamGraph svg").css("-webkit-transform", lastTransform);
	}

	//stretch the streamgraph vertically
	function getYScale(){
		var graphPos = GraphManager.getGraphPos();
		var offset = graphPos.offset, scale = graphPos.scale;
		var lobound = Math.floor(offset*758);
		var hibound = Math.ceil((offset+scale)*758);
		var max = getMaxData(GraphManager.getDataArray(), lobound, hibound);
		if(max==0) return 0;
		return graphHeight/max;
	}

	function getMaxData(data, lobound, hibound){
		if(data.length==0) return 0;
		var len = data[0].data.length-1;
		var bound = (len<hibound) ? len : hibound;
		var max = 0;
		for(var j=lobound; j<=bound; j++){
			var sum = 0;
			for(var i in data){
				sum += data[i].data[j];
			}
			if(sum>max) max = sum;
		}
		return max;
	}

	function saveElements(){
		$('#streamGraph g>a').each(function(){
			var title = $(this).attr("title");
			title.match(/^layer-(\d+)$/);
			var id = RegExp.$1;
			elements[id] = $(this).find("path");
			$(this).removeAttr("title"); //duplicate with mouseover => this.title("") to save re-rendering
		});
	}

	function highlightItem(id, persistent){
		HighlightManager.highlightDomain(id, {persistent: persistent, parent: $("#textContent")});
		HighlightManager.highlightLayer(id, persistent);
		HighlightManager.scrollToItem(id, (persistent) ? 0 : 500);
		//GraphManager.highlightTopGraph(GraphManager.getDataIndex(id));
		//TopGraph.highlight(GraphManager.getDataIndex(id)); //highlight the corresponding sections of the topGraph
	}

	function lowlightItem(id, clearPersistent){
		HighlightManager.cancelScroll(id); 
		HighlightManager.lowlightDomain(id, {clearPersistent: clearPersistent, parent: $("#textContent")});
		HighlightManager.lowlightLayer(id, clearPersistent);
		//GraphManager.highlightTopGraph(-1);
		//TopGraph.highlight(-1); //cancel highlight on the topGraph
	}

	function toggleItemHighlight(id, toggle){
		if(toggle)
			highlightItem(id, true);
		else
			lowlightItem(id, true);
	}
})();
