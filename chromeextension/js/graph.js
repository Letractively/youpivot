var GraphManager = {};

(function(){
	var master = GraphManager;

	master.drawTopGraph = function(){
		//generate test data
		var data = pv.range(0, 50, .1).map(function(x) {
			return {x: x, y: Math.abs(Math.sin(x/2), 2)/2+Math.random()};
		});

		var box = $("#topgraph");

		var w = box.width(),
			h = box.height(),
			x = pv.Scale.linear(0, 50).range(0, w),
			y = pv.Scale.linear(0, 2).range(0, h);

		var vis = new pv.Panel()
			.canvas("topgraph")
			.width(w)
			.height(h);

		vis.add(pv.Bar)
			.data(data)
			.bottom(1)
			.left(function(d){ return x(d.x)})
			.width(2)
			.height(function(d){ return y(d.y); })
			.def("active", false)
			.fillStyle(function(d){ return this.active() ? "rgba(0, 0, 0, 255)" : "rgba(200, 200, 200, 190)"; })
			//.strokeStyle("rgba(200, 200, 200, 100)")
			.lineWidth(0);


		var dragged = false;
		var hilight = {x: 200, dx: 100};
		vis.add(pv.Panel)
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

		vis.render();

	}

	function scale(num, max){
		return num/max;
	}

	function scaleToSection(offset, cap){
		xScale = 0.1/cap; //0.1 is the smallest value coz the graph is rendered at 10x width
		$("#steamgraph svg").css("-webkit-transform", "scaleX("+xScale+") translateX("+(-offset*width)+"px)");
	}

	var max, width, height;
	var n = 20, m=400, data = layers(n,m);
	
	function drawSection(offset, cap){
		if(cap===undefined) cap = 1; //show all if cap not defined
		cap = cap*(m-1);
		offset = offset*(m-1);
		var x = pv.Scale.linear(offset, cap+offset).range(0, width),
			y = pv.Scale.linear(0, max+1).range(0, height);
		var panel = new pv.Panel()
			.canvas("steamgraph")
			.width(width)
			.height(height)
		panel.add(pv.Layout.Stack)
			.layers(data)
			.values(function(d){ return data[this.index].data; })
			.order("inside-out")
			.offset("silohouette")
			.x(function(d, p){ return x(this.index) })
			.y(function(d, p){ return pv.Scale.linear(0, max+1).range(0, height)(d); })
			.layer.add(pv.Area)
			.def("active", false)
			.fillStyle(function(d, p){ var a = (this.active()) ? 1 : 0.8; return pv.color(p.color).alpha(a);})
			.strokeStyle(function(){return this.fillStyle().alpha(1)})
			.lineWidth(2)
			.event("mouseover", function(d, p){ this.active(true); return this; })
			.event("mouseout", function(d){ this.active(false); return this; })
			.event("click", function(d){ alert("You clicked me!\nMy color is "+this.fillStyle().color); });
		panel.render();
	}

	master.drawSteamGraph = function(){
		var sgbox = $("#steamgraph");
		sgbox.width(sgbox.width()); //Hack to make it not expand itself because the content is big
		width = sgbox.width()*10;
		height = sgbox.height()-20;
		max = getMaxFromSteam(data);
		drawSection(0, 1);
	}

	function getMaxFromSteam(data){
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

	function rand(cap){ return Math.floor(Math.random()*cap); }

	/*** test data generator ***/
	/* Inspired by Lee Byron's test data generator. */
	function layers(n, m){
	  function bump(a) {
		var x = 1 / (.1 + Math.random()),
			y = 2 * Math.random() - .5,
			z = 10 / (.1 + Math.random());
		for (var i = 0; i < m; i++) {
		  var w = (i / m - y) * z;
		  a[i] += x * Math.exp(-w * w);
		}
	  }
	  return pv.range(n).map(function() {
		  var a = [], i;
		  for (i = 0; i < m; i++) a[i] = 0;
		  for (i = 0; i < 5; i++) bump(a);
		  var color = "rgb("+rand(256)+", "+rand(256)+", "+rand(256)+")";
		  return {data: a, color: color};
		});
	}
})();
