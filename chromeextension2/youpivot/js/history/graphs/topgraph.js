include_("Protovis");

var TopGraph = new (function _TopGraph(){
	var self = this;

	var hPanel; //highlight panel from protovis (the brighter color area when item hovered)
	var sPanel; //selection panel (the grey overlay)

	var defSelect = 28; //default selection width (when clicked)
    var graphWidth = 0;

    self.init = function(width){
        graphWidth = width;
    }

	self.drawHighlight = function(array, color){
		hPanel.children[0].data(array);
		hPanel.children[0].fillStyle(color);
		hPanel.render();
	}

    // Note: no callback fired for this function
	self.setSelection = function(selectionStart, selectionEnd){
		if(selectionEnd>1) selectionEnd = 1;
		var selection = {x: (selectionStart*(graphWidth-20)), dx: (selectionEnd*(graphWidth-20))};
        if(sPanel){
            sPanel.data([selection]);
            sPanel.render();
        }
	}

    // implement delegate functions

    var delegateFunctions = {};

    function callDelegate(name, params){
        var func = delegateFunctions[name];
        if(typeof func == "function"){
            func(params[0], params[1], params[2]);
        }
    }

    self.onSelectionStart = function(func){
        delegateFunctions["selectionStart"] = func;
    }

    self.onSelectionEnd = function(func){
        delegateFunctions["selectionEnd"] = func;
    }

    self.onSelectionMove = function(func){
        delegateFunctions["selectionMove"] = func;
    }

    self.onSelectionEdge = function(func){
        delegateFunctions["selectionEdge"] = func;
    }

    var DRAGFLIPMARGIN = 40; // the margin out of boundary before page flip while dragging
    // actual draw algorithm

	self.draw = function(data, max, displayRange){
		data = pv.range(0, 758, 1).map(function(x) {
			return {x: x, y: data[x]};
		});

		var box = $("#topGraph");

		var w = graphWidth-20;
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
		var selection = {x: (displayRange.offset*w), dx: (displayRange.scale*w)};
		sPanel = tg.add(pv.Panel);
		sPanel.data([selection])
			.cursor("crosshair")
			.events("all")
			.event("mousedown", pv.Behavior.select())
			.event("select", function(d){
                if(this.mouse().x < -DRAGFLIPMARGIN){
                    edge("left");
                } else if(this.mouse().x > this.root.width() + DRAGFLIPMARGIN){
                    edge("right");
                }
                dragged = true;
                moveScale(d);
            })
			.event("selectstart", function(d){ startScale(d); })
			.event("selectend", function(d){
				if(dragged){
				   dragged = false; 
				}else{
					d.x -= defSelect/2; 
					if(d.x<0) d.x = 0;
					if(d.x>w-defSelect) d.x = w-defSelect;
					d.dx = defSelect;
                    moveScale(d);
                    endScale(d);
					return this.parent; 
				}
                endScale(d);
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
                if(this.mouse().x < -DRAGFLIPMARGIN){
                    edge("left");
                } else if(this.mouse().x > this.root.width() + DRAGFLIPMARGIN){
                    edge("right");
                }
				dragged = true;
                moveScale(d);
				//return this;
			})
			.event("dragstart", function(d){ startScale(d); })
			.event("dragend", function(d){
				if(dragged){
					dragged = false;
				}else{
					d.x = this.mouse().x-defSelect/2;
					if(d.x<0) d.x = 0;
					if(d.x>w-defSelect) d.x = w-defSelect;
					d.dx = defSelect;
                    moveScale(d);
                    endScale(d);
					//return this;
				}
                endScale(d);
			});
            /*
		bar.anchor("left").add(pv.Bar)
			.top(0)
			.width(4)
			.height(h)
			.fillStyle("rgba(255, 255, 255, 0.01)") //alpha of 0 will destroy the mouse events
			.cursor("e-resize")
			.event("mousedown", pv.Behavior.resize("left"))
			.event("resize", function(d){
                moveScale(d);
                return this.parent;
            })
			.event("resizestart", function(d){ startScale(d); })
			.event("resizeend", function(d){ endScale(d); });
		bar.anchor("right").add(pv.Bar)
			.top(0)
			.width(4)
			.height(h)
			.fillStyle("rgba(255, 255, 255, 0.01)")
			.cursor("e-resize")
			.event("mousedown", pv.Behavior.resize("right"))
			.event("resize", function(d){
                moveScale(d); 
                return this.parent;
            })
			.event("resizestart", function(d){ startScale(d); })
			.event("resizeend", function(d){ endScale(d); });
            */
		tg.render();
		self.obj = tg;

        function startScale(d){
            startPos = {offset: d.x/w, scale: d.dx/w};
            callDelegate("selectionStart", [startPos]);
        }
        function endScale(d){
            var currentPos = {offset: d.x/w, scale: d.dx/w};
            callDelegate("selectionEnd", [startPos, currentPos]);
        }
        function moveScale(d){
            var currentPos = {offset: d.x/w, scale: d.dx/w};
            callDelegate("selectionMove", [startPos, currentPos]);
        }
        function edge(direction){
            if(pref("topGraphEdge"))
                callDelegate("selectionEdge", [direction]);
        }
    }

	function addImportance(data, index){
		var output = 0;
        //console.log("topgraph", data[0].data[index]);
		for(var i in data){
            if(data[i].data[index])
                output += data[i].data[index];
		}
        //console.log("topgraph", output);
		return output;
	}
})();
