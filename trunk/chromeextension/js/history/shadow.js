var ShadowManager = {};

(function(){
	var m = ShadowManager;

	m.setShadowHeight = function(h){
		$("#graphShadow").height(h);
	}

	m.refresh = function(){
		var h = $("#visualGraphs").outerHeight(true);
		m.setShadowHeight(h);
	}
	
	$(function(){ //initialize
		m.refresh();
	});
})();
