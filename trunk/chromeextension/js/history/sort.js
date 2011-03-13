var SortManager = {};

(function(){
	var m = SortManager;
	m.sortBy = "chronological";

	var sorts = ["chronological", "by type"];
	var def = "chronological"; //default value;
	m.getSortMethod = function(){
		if(m.sortBy == "chronological") return "date";
		if(m.sortBy == "by type") return "domain";
		return m.sortBy;
	}
	m.sortItems = function(items){
		items.sort(sortFunction);
	}
	function sortFunction(a, b){
		if(m.sortBy == "by type"){
			var str = subtractStr(a.domain.name, b.domain.name);
			if(str!=0) return str;
			return b.startTime-a.startTime;
		}else if(m.sortBy == "chronological")
			return b.startTime-a.startTime;
	}
	function subtractStr(a, b){
		if(a.toLowerCase()==b.toLowerCase()) return 0;
		else return (a.toLowerCase()>b.toLowerCase()) ? 1 : -1;
	}
	//wrapper
	m.sort = function(name){
		$("#sortItems").hList("select", {name: name});
		sort(name);
	}
	function sort(name){
		m.sortBy = name;
		if($("#searchResults").is(":visible")) //need this because or else sometimes filters for search will be displayed instead
			SearchManager.reloadResult();
		TableManager.reload();
		FilterManager.filterTime();
		FilterManager.filter();
		return true;
	}
	$(function(){
		$("#sortItems").hList("loadArray", {items: sorts, callback: sort});
		m.sort(def);
	});
})();
