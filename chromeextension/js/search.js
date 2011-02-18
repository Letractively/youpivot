var SearchManager = {};

(function(){
	var m = SearchManager;

	function search(needle){
		console.log("search for "+needle);
	}

	$(function(){
		$("#searchBox").keyup(function(){
			search($(this).val());
		});
	});
})();
