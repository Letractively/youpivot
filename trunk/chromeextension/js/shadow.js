var ShadowManager = {};

(function(){
	var m = ShadowManager;

	m.setShadowHeight = function(h){
		$("#graphShadow").height(h);
	}
	
	$(function(){ //initialize
		var h = $("#visualGraphs").outerHeight(true);
		m.setShadowHeight(h);
	});
})();
