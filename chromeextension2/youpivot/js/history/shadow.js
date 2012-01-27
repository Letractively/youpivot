var ShadowManager = new (function _ShadowManager(){
    var self = this;

    self.init = function(){
        $("#graphShadow").height(270);
    }

	self.setShadowHeight = function(h){
		$("#graphShadow").height(h).trigger("resize");
	}

	self.animate = function(newHeight, time){
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

	self.refresh = function(){
		var h = $("#visualGraphs").outerHeight(true);
        console.log(h);
		self.setShadowHeight(h);
	}
})();
