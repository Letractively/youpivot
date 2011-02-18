var PreferenceManager = {};

(function(){
	var master = PreferenceManager;

	master.setOption = function(name, value){
		var options = getOptions();
		if(!options) options = {};
		options[name] = value;
		localStorage["options"] = JSON.stringify(options);
	}

	master.getOption = function(name){
		var options = getOptions();
		if(!options) return false;
		return options[name];
	}

	function getOptions(){
		var opt = localStorage["options"];
		if(!opt) return false;
		var options = JSON.parse(opt);
		if(!options) return false;
		return options;
	}
})();
