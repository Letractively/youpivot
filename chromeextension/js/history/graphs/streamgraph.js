var StreamGraph = {};

(function(){
	m = StreamGraph;

	var width;
	var elements = {}; //DOM objects of the streamGraph layers

	m.highlightLayer = function(id, persistent){
		var index = GraphManager.getDataIndex(id);
		if(!index) return;
		dataArray[index].active = true;
		if(persistent) dataArray[index].highlight = true;
		//directly change the object in DOM rather than re-render to improve performance (significantly)
		var color = dataArray[index].color;
		elements[id].attr("fill", color);

		m.highlightTop(index);
	}

	m.lowlightLayer = function(id, clearPersistent){
		var index = GraphManager.getDataIndex(id);
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

	m.render = function(){
		console.log("re-rendering streamGraph");
		m.obj.render();
	}

	m.draw = function(data, max){
		var sgbox = $("#steamGraph");
		//sgbox.width(sgbox.width()); //Hack to make it not expand itself because the content is big - translating CSS 100% width to pixels for the system
		var width = GraphManager.width*10;
		var height = sgbox.height();
		
		var x = pv.Scale.linear(0, 758).range(0, width),
			y = pv.Scale.linear(0, max*1.1).range(0, height);
		var streamGraph = new pv.Panel()
			.canvas("steamGraph")
			.width(width)
			.height(height)
			.add(pv.Layout.Stack)
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

		streamGraph.render();
		m.obj = streamGraph;
		saveElements();
	}

	m.scale = function(scale, offset, width){
		$("#steamGraph svg").css("-webkit-transform", "scaleX("+scale+") translateX("+(-offset*width)+"px)");
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
		TopGraph.highlight(GraphManager.getDataIndex(id)); //highlight the corresponding sections of the topGraph
	}

	function lowlightItem(id, clearPersistent){
		HighlightManager.cancelScroll(id); 
		HighlightManager.lowlightDomain(id, clearPersistent);
		TopGraph.highlight(-1); //cancel highlight on the topGraph
	}

	function toggleItemHighlight(id, toggle){
		if(toggle)
			highlightItem(id, true);
		else
			lowlightItem(id, true);
	}
})();
