var PrefManager = {};

(function(){
	var m = PrefManager;

	m.setOption = function(name, value){
		var options = getOptions();
		if(!options) options = {};
		options[name] = value;
		localStorage["options"] = JSON.stringify(options);
	}

	m.getOption = function(name){
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
