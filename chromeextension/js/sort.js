var SortManager = {};

(function(){
	var m = SortManager;

	var sorts = ["chronological", "by type"];
	var def = "chronological"; //default value;
	function sort(obj){
		if(!obj) return;
		$("#sortItems .active").removeClass("active");
		obj.addClass("active");
		if(obj.parent().attr("id")=="moreSorters")
			$("#moreSorterBtn").addClass("active");
		$("#moreSorters").hide();
		console.log("sort", obj.html());
	}
	//wrapper
	m.sort = function(name){
		sort(getBtn(name));
	}
	function getBtn(name){
		var obj = false;
		$("#sortItems a").each(function(){
			if($(this).text()==name){
				obj = $(this);
				return;
			}
		});
		return obj;
	}
	$(function(){
		m.list = new HorizontalList("Sorter", sorts, sort);
		m.sort(def);
	});
})();
