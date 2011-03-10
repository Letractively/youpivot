var TopGraph = {};

(function(){
	var m = TopGraph;

	var hPanel; //highlight panel from protovis
	var sPanel; //selection panel

	m.render = function(){
		m.obj.render();
	}

	m.highlight = function(i){
		var data = (i==-1) ? [] : GraphManager.getData(i).data;
		hPanel.children[0].data(data);
		hPanel.render();
	}

	m.setSelection = function(offset, cap){
		var graphPos = GraphManager.getGraphPos();
		var selection = {x: (graphPos.offset*GraphManager.width), dx: (graphPos.scale*GraphManager.width)};
		sPanel.children[0].data = [selection];
		sPanel.render();
	}

	m.draw = function(data, max){
		data = pv.range(0, 758, 1).map(function(x) {
			return {x: x, y: addImportance(data, x)};
		});

		var box = $("#topGraph");

		var w = GraphManager.width;
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
			.event("select", function(d){ dragged = true; GraphManager.setSelectionScale(d.x/w, d.dx/w); })
			.event("selectend", function(d){
				if(dragged){
				   dragged = false; 
				}else{
					d.x -= 50; 
					if(d.x<0) d.x = 0;
					if(d.x>w-100) d.x = w-100;
					d.dx = 100;
					GraphManager.setSelectionScale(d.x/w, d.dx/w);
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
			.event("drag", function(d){ dragged = true; GraphManager.setSelectionScale(d.x/w, d.dx/w); })
			.event("dragend", function(d){
				if(dragged){
					dragged = false;
				}else{
					d.x = this.mouse().x-50;
					if(d.x<0) d.x = 0;
					if(d.x>w-100) d.x = w-100;
					d.dx = 100;
					GraphManager.setSelectionScale(d.x/w, d.dx/w);
					return this;
				}
			})
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
