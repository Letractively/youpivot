var TableManager = {};

//This class is using the structure itemtable.js as backbone
(function(){
	var m = TableManager;

	m.addItem = function(id, date, name, color, url, favUrl, item){
		var obj = {id: id, date: date, name: name, color: color, url: url, favUrl: favUrl};
		var row = $("#textContent").itemTable("addItem", obj, item);
		row.mouseover(function(){
			HighlightManager.highlightLayer(id, false);
		});
		row.mouseout(function(){
			HighlightManager.lowlightLayer(id, false);
		});
	}

	m.clearItems = function(){
		$("#textContent").html("");
	}
})();
