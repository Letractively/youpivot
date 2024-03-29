// shorthand function
function pref(label){
	return PrefManager.getOption(label);
}

var PrefManager = new (function _PrefManager(){
    var self = this;
	var defaults = {

        /*** General ***/

        "defaultTab": "traditionalhistory",

        /*** YouPivot ***/

		"collapseGraph": false,
		"sortMethod": "chronological",
		"keywordHighlight": false,
		"pageFlipRange": 6*3600000, 
		"pivotInterval": 3600000,
        "topGraphEdge": false,

		//scrolling/flipping preferences
		"scrollMethod": "expand",
		"scrollScale": 0.03,
		"stopFlipOnMove": true,

		//highlight colors
		"highlightBg": "+0.35",
		"highlightFg": "same",
		"normalGraph": "+0.2",
		"highlightGraph": "same",
		"relatedBg": 0.95,
		"relatedFg": "+0.2",
		"lowlightFg": "+0.15",
		"lowlightBg": "transparent",

        // intrumentation
        "logging": false,
        "showLog": true,
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

	self.setOption = function(label, value){
		var options = getOptions();
		if(!options) options = {};
		options[label] = value;
		localStorage["options"] = JSON.stringify(options);
        $(window).trigger("preferenceChanged", [{key: key, value: value}])
		console.log("Options saved");
	}

	self.getOption = function(label){
		var options = getOptions();
		if(!options) return getDefault(label);
		var output = options[label];
		if(typeof output == "undefined")
			return getDefault(label);
		return output;
	}

    self.onPreferenceChanged = function(key, func){
        $(window).bind("preferenceChanged", function(event, pair){
            if(pair.key == key)
                func(pair);
        })
    }

})();
