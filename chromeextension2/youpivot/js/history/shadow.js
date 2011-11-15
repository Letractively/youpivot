var ShadowManager = {};

(function(){
	var m = ShadowManager;

	m.setShadowHeight = function(h){
		$("#graphShadow").height(h).trigger("resize");
	}

	m.animate = function(newHeight, time){
		$("#graphShadow").animate({height: newHeight}, {
			duration: 200, 
			step: function(){
				//calls for resize on every step
				//resource intensive but better visual effect
				//so don't hook so many things on this event
				$(this).trigger("resize");
			}
		});
	}

	m.refresh = function(){
		var h = $("#visualGraphs").outerHeight(true);
        console.log(h);
		m.setShadowHeight(h);
	}

    $(function(){
        $("#graphShadow").height(270);
    });
})();