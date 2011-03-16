var StreamGraph = {};

(function(){
	m = StreamGraph;

	var width;
	var elements = {}; //DOM objects of the streamGraph layers

	m.changeColor = function(id, color){
		//directly change the object in DOM rather than re-render to improve performance (significantly)
		elements[id].attr("fill", color);
	}

	m.render = function(){
		console.log("re-rendering streamGraph");
		m.obj.render();
	}

	m.draw = function(data, max){
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
				//p.active = true; 
				//return this; 
				})
			.event("mouseout", function(d, p){ 
				lowlightItem(p.id, false); 
				//p.active = false; 
				//return this; 
				})
			.event("click", function(d, p){ 
			  	p.highlight = !p.highlight; 
				toggleItemHighlight(p.id, p.highlight); 
				//return this; 
			});

		streamGraph.render();
		m.obj = streamGraph;
		saveElements();
	}

	m.scale = function(scale, offset, width){
		$("#streamGraph svg").css("-webkit-transform", "scaleX("+scale+") translateX("+(-offset*width)+"px)");
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
		HighlightManager.highlightDomain(id, persistent, $("#textContent"));
		HighlightManager.highlightLayer(id, persistent);
		HighlightManager.scrollToItem(id, (persistent) ? 0 : 500);
		//GraphManager.highlightTopGraph(GraphManager.getDataIndex(id));
		//TopGraph.highlight(GraphManager.getDataIndex(id)); //highlight the corresponding sections of the topGraph
	}

	function lowlightItem(id, clearPersistent){
		HighlightManager.cancelScroll(id); 
		HighlightManager.lowlightDomain(id, clearPersistent, $("#textContent"));
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
