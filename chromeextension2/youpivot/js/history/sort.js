var SortManager = new (function _SortManager(){
    var self = this;
	self.sortBy = "chronological";

	var sorts = ["chronological", "by type"];
	var def = "chronological"; //default value;

    self.init = function(){
		$("#sortItems").hList("loadArray", {items: sorts, callback: sort});
		$("#sortItems").hList("select", {name: "chronological"});
		//self.sort(def);
    }

	self.getSortMethod = function(){
		if(self.sortBy == "chronological") return "date";
		if(self.sortBy == "by type") return "domain";
		return self.sortBy;
	}
	self.sortItems = function(items){
		if(!items) return [];
		items.sort(sortFunction);
	}
	function sortFunction(a, b){
		if(self.sortBy == "by type"){
			var str = subtractStr(a.domain.name, b.domain.name);
			if(str!=0) return str;
			return b.startTime-a.startTime;
		}else if(self.sortBy == "chronological")
			return b.startTime-a.startTime;
	}
	function subtractStr(a, b){
		if(a.toLowerCase()==b.toLowerCase()) return 0;
		else return (a.toLowerCase()>b.toLowerCase()) ? 1 : -1;
	}
	//wrapper
	self.sort = function(name){
		$("#sortItems").hList("select", {name: name});
		sort(name);
	}
	function sort(name){
		self.sortBy = name;
		TableManager.changeSchema(name);
		SearchManager.changeSchema(name);
		FilterManager.filter.triggerFilter();
		return true;
	}
})();
