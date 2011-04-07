var PrefManager = {};

(function(){
	var m = PrefManager;
	var defaults = {
		"collapseGraph": false,
		"sortMethod": "chronological",
		"keywordHighlight": false,
		"scrollMethod": "expand",
		//highlight colors
		"highlightBg": 0.9,
		"highlightFg": "same",
		"normalGraph": 0.7,
		"highlightGraph": "same",
		"relatedBg": 0.96,
		"relatedFg": 0.75,
		"lowlightFg": 0.8,
		"lowlightBg": "transparent",
	};

	function getDefault(label){
		var output = defaults[label];
		return output;
	}

	function getOptions(){
		var opt = localStorage["options"];
		if(!opt) return false;
		var options = JSON.parse(opt);
		if(!options) return false;
		return options;
	}

	m.setOption = function(label, value){
		var options = getOptions();
		if(!options) options = {};
		options[label] = value;
		localStorage["options"] = JSON.stringify(options);
		console.log("Options saved");
	}

	m.getOption = function(label){
		var options = getOptions();
		if(!options) return getDefault(label);
		var output = options[label];
		if(typeof output == "undefined")
			return getDefault(label);
		return output;
	}

})();
