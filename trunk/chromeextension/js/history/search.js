var SearchManager = {};

(function(){
	var m = SearchManager;

	function search(needle){
		Connector.send("search", {needle: needle});
	}

	$(function(){
		$("#searchBox").keyup(function(){
			search($(this).val());
		});
	});
})();
