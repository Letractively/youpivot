var SearchManager = {};

(function(){
	var m = SearchManager;
	var result = [];
	var state = false; //is search currently in use

	m.getState = function(){
		return state;
	}

	m.changeSchema = function(sortBy){
		TableHelper.changeSchema($("#searchResults"), sortBy);
	}

	function search(needle){
		if(needle==""){ antiSearch(); return; }
		needle = needle.toLowerCase(); //change to lower case as the search algorithm is also changed to lower case (to make it case insensitive)
		Connector.send("search", {q: needle}, {
			onSuccess: function(response){
				var result = parseResponse(response);
				showResults(result, false);
				setTimeout(function(){ if($("#searchBox").val()==needle) showResults(result, true); }, 1000); // to prevent loading too many results from freezing the UI
			},
			onError: function(response){
				alert("error while searching");
			}
		});
	}

	function parseResponse(response){
		var input = JSON.parse(response).rows;
		var output = [];
		for(var i in input){
			output[i] = Translator.translateItem(input[i].value);
		}
		return output;
	}

	function showResults(results, realLoad){
		$("#searchResults").trigger("search", true);
		state = true;
		TermManager.clearTerms();
		DomainManager.clearDomains();
		SortManager.sortItems(result);
		loadResults(results, realLoad);
	}

	function loadResults(results, realLoad){
		$("#searchResults").itemTable("clear");
		TermManager.clearTerms(true);
		DomainManager.clearDomains(true);
		for(var i in results){
			if(!realLoad && i>30) return;
			var item = results[i];
			TermManager.addTerms(item.keywords);
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			displayItem(i, item);
		}
		TermManager.display();
		DomainManager.display();
		$("#searchResults").itemTable("refreshTopRows");
	}

	m.reloadResult = function(){
		SortManager.sortItems(result);
		loadResults(result);
	}

	function displayItem(id, item){
		item.id = id;
		TableHelper.addItem($("#searchResults"), item);
	}

	m.antiSearch = antiSearch;
	function antiSearch(){
		state = false;
		$("#searchResults").trigger("search", false);
	}

	$("#searchResults").bind("search", function(e, active){
		if(active){
			$("#searchResults").show();
		}else{
			$("#searchResults").hide();
		}
	});

	var lastSearch = "";
	$(function(){
		$("#searchBox").keyup(function(){
			lastSearch = $(this).val();
			search($(this).val());
		}).click(function(){
			if(lastSearch.length>0 && $(this).val()==""){
				search(""); //invoke antiSearch()
			}
		});
	});
})();

var debugSearch = [];
debugSearch[0] = {title: "Google", url: "http://www.google.com/", keywords: ["Google", "rocks"], startTime: new Date().getTime(), endTime: new Date().getTime()+1, importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: [], domain: {color: "#FF0000", favUrl: "http://www.google.com/favicon.ico", name: "google.com"}};
debugSearch[1] = {title: "Google Docs", url: "http://docs.google.com/", keywords: ["Google", "docs"], startTime: new Date().getTime(), importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: [], domain: {color: "#FF0000", favUrl: "http://www.google.com/favicon.ico", name: "google.com"}};
debugSearch[2] = {title: "Apple", url: "http://www.apple.com/", keywords: ["Apple", "rocks", "magical"], startTime: new Date().getTime()-86400000, endTime: new Date().getTime()-86400000+3600000, importance: [0.5, 0.5, 0.7, 0.9, 1.2, 1.5, 1.8, 0, 1, 0, 1, 0], events: [], domain: {color: "#0000FF", favUrl: "http://www.apple.com/favicon.ico", name: "apple.com"}};
debugSearch[3] = {title: "Apple - Mac", url: "http://www.apple.com/mac", keywords: ["Apple", "mac", "magical", "revolutionary"], startTime: new Date().getTime()-120000, endTime: new Date().getTime()-60000, importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: [], domain: {color: "#0000FF", favUrl: "http://www.apple.com/favicon.ico", name: "apple.com"}};
