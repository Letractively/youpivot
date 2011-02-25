var EventManager = {};

(function(){
	var m = EventManager;

	m.add = function(){
		alert("adding single event is not implemented yet");
		console.log("add single event");
	}

	function addIcon(icon, name){
		var img = IconFactory.createIcon(icon, name).addClass("applicationIcon");
		$("#applications").append(img);
	}
})();
