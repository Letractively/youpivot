var TopGraph = {};

(function(){
	var m = TopGraph;

	var hPanel; //highlight panel from protovis (the brighter color area when item hovered)
	var sPanel; //selection panel (the grey overlay)

	var defSelect = 28; //default selection width (when clicked)

	m.render = function(){
		m.obj.render();
	}

	m.highlight = function(array, color){
		hPanel.children[0].data(array);
		hPanel.children[0].fillStyle(color);
		hPanel.render();
	}

	m.setSelection = function(offset, cap){
		if(cap>1) cap = 0;
		var selection = {x: (offset*(GraphManager.width-20)), dx: (cap*(GraphManager.width-20))};
		sPanel.data([selection]);
		sPanel.render();
	}

	m.draw = function(data, max){
		data = pv.range(0, 758, 1).map(function(x) {
			return {x: x, y: addImportance(data, x)};
		});

		var box = $("#topGraph");

		var w = GraphManager.width-20;
			h = box.height(),
			x = pv.Scale.linear(0, 758).range(0, w),
			y = pv.Scale.linear(0, max).range(0, h);

		var tg = new pv.Panel()
			.canvas("topGraph")
			.width(w)
			.height(h);

		var core = tg.add(pv.Panel);
		core.add(pv.Area)
			.data(data)
			.bottom(0)
			.left(function(d){ return x(d.x); })
			.height(function(d){ return y(d.y); })
			.fillStyle("rgb(176,196,222)")

		hPanel = tg.add(pv.Panel);
		hPanel.add(pv.Area)
			.data([])
			.bottom(0)
			.left(function(d){ return x(this.index); })
			.height(function(d){ return y(d); })
			.fillStyle("rgb(130,140,255)")

		var dragged = false;
		var graphPos = GraphManager.getGraphPos();
		var selection = {x: (graphPos.offset*w), dx: (graphPos.scale*w)};
		sPanel = tg.add(pv.Panel);
		sPanel.data([selection])
			.cursor("crosshair")
			.events("all")
			.event("mousedown", pv.Behavior.select())
			.event("select", function(d){ dragged = true; GraphManager.topGraphCallScale(d.x/w, d.dx/w); })
			.event("selectstart", function(){ GraphManager.startSelection(); })
			.event("selectend", function(d){
				if(dragged){
				   dragged = false; 
				}else{
					d.x -= defSelect/2; 
					if(d.x<0) d.x = 0;
					if(d.x>w-defSelect) d.x = w-defSelect;
					d.dx = defSelect;
					GraphManager.topGraphCallScale(d.x/w, d.dx/w);
					GraphManager.finishSelection();
					return this.parent; 
				}
				GraphManager.finishSelection();
			})
		var bar = sPanel.add(pv.Bar)
			.left(function(d){ return d.x })
			.top(0)
			.width(function(d){ return d.dx})
			.height(h)
			.fillStyle("rgba(233, 233, 255, 0.2)")
			.strokeStyle("rgba(128, 128, 128, 0.8)")
			.lineWidth(0.5)
			.cursor("move")
			.event("mousedown", pv.Behavior.drag())
			.event("drag", function(d){
				dragged = true;
			   	GraphManager.topGraphCallScale(d.x/w, d.dx/w);
				return this.parent;
			})
			.event("dragstart", function(){ GraphManager.startSelection(); })
			.event("dragend", function(d){
				if(dragged){
					dragged = false;
				}else{
					d.x = this.mouse().x-defSelect/2;
					if(d.x<0) d.x = 0;
					if(d.x>w-defSelect) d.x = w-defSelect;
					d.dx = defSelect;
					GraphManager.topGraphCallScale(d.x/w, d.dx/w);
					GraphManager.finishSelection();
					return this.parent;
				}
				GraphManager.finishSelection();
			});
		bar.anchor("left").add(pv.Bar)
			.top(0)
			.width(4)
			.height(h)
			.fillStyle("rgba(255, 255, 255, 0.01)") //alpha of 0 will destroy the mouse events
			.cursor("e-resize")
			.event("mousedown", pv.Behavior.resize("left"))
			.event("resize", function(d){ GraphManager.topGraphCallScale(d.x/w, d.dx/w); return this.parent; })
			.event("resizestart", function(){ GraphManager.startSelection(); })
			.event("resizeend", function(){ GraphManager.finishSelection(); });
		bar.anchor("right").add(pv.Bar)
			.top(0)
			.width(4)
			.height(h)
			.fillStyle("rgba(255, 255, 255, 0.01)")
			.cursor("e-resize")
			.event("mousedown", pv.Behavior.resize("right"))
			.event("resize", function(d){ GraphManager.topGraphCallScale(d.x/w, d.dx/w); return this.parent; })
			.event("resizestart", function(){ GraphManager.startSelection(); })
			.event("resizeend", function(){ GraphManager.finishSelection(); });
		tg.render();
		m.obj = tg;
	}

	function addImportance(data, index){
		var output = 0;
		for(var i in data){
			output += data[i].data[index];
		}
		return output;
	}
})();
