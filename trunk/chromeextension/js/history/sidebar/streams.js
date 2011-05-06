var StreamManager = {};

(function(){
	var m = StreamManager;
	var streams = new Array();

	m.addStreams = function(input){
		for(var i in input){
			m.addStream(input[i].name);
		}
	}
	m.addStream = function(name){
		var index = getStreamIndex(name);
		if(index==-1){
			streams[streams.length] = {name: name, rating: 1};
		}else{
			var stream = streams[index];
			streams[index] = {name: name, rating: stream.rating+1};
			if(stream.rating+1>best) best = stream.rating+1;
		}
	}

	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	m.display = function(){
		streams.sort(sortFunction);
		$("#streamFilters").html("");
		for(var i in streams){
			displayStream(streams[i].name, streams[i].rating);
		}
	}

	var best = 1; //dummy. To be overwritten before first call
	function displayStream(name, rating){
		var icon = getStreamIcon(name);
		var tImg = IconFactory.createTextIcon(icon, name, "wrap");
		var img = $(tImg);
		img.css("opacity", Helper.decay(rating, 1, best));
		$("#streamFilters").append(img);
		img.data("title", name);
		img.click(function(e){
			if(e.which!==3){
				includeFilter(this);
			}
		});
		img.contextMenu("stream_menu", {
			"Include this stream": {
				click: includeFilter
			},
			"Exclude this stream": {
				click: excludeFilter
			}
		}, 
		{ title: tImg+"<span>"+name+"<span>" });
		function includeFilter(obj){
			var label = IconFactory.createTextIcon($(obj).attr("src"), "click to remove", "wrap");
			FilterManager.addFilter("stream", $(obj).data("title"), label);
		}
		function excludeFilter(obj){
			var label = IconFactory.createTextIcon($(obj).attr("src"), "click to remove", "wrap");
			FilterManager.addOutcast("stream", $(obj).data("title"), label);
		}
	}

	function getStreamIcon(name){
		switch(name){
			case "chrometab":
				return "images/streams/chrome.png";
			case "timemark":
				return "images/timemark.png";
			default: // FIXME make this extensible
				console.log("Unknown stream: "+name);
				return "";
		}
	}

	function getStreamIndex(name){
		for(var i in streams){
			if(streams[i].name == name){
				return i;
			}
		}
		return -1;
	}

	m.clearStreams = function(retainOrder){
		if(!retainOrder){
			streams = [];
		}else{
			for(var i in streams){
				streams[i].rating = 0;
			}
		}
		best = 1;
		$("#streamFilters").html("");
	}
})();
