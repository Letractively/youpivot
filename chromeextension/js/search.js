var SearchManager = {};

(function(){
	var m = SearchManager;

	function search(needle){
		var items = ItemManager.getItems();
		for(var i in items){
			if(isRelated(items[i], needle)){
				console.log(items[i], "found");
			}
		}
		console.log("search for "+needle);
	}

	function isRelated(item, needle){
		var keywords = item.keywords;
		var regex = new RegExp(needle, "i");
		for(var i in keywords){
			if(keywords[i].match(regex)){
				return true;
			}
		}
		if(item.title.match(regex)){
			return true;
		}
		return false;
	}

	$(function(){
		$("#searchBox").keyup(function(){
			search($(this).val());
		});
	});
})();
