var SearchManager = {};

(function(){
	var m = SearchManager;
	var result = [];
	var state = false; //is search currently in use

	m.getState = function(){
		return state;
	}

	m.changeSchema = function(sortBy){
		TableHelper.changeSchema($("#y-searchResults"), sortBy, m);
	}

	function search(needle){
		if(needle==""){ antiSearch(); return; }
		needle = needle.toLowerCase(); //change to lower case as the search algorithm is also changed to lower case (to make it case insensitive)
		Connector.send("search", {q: needle}, {
			onSuccess: function(response){
				var result = parseResponse(response);
				showResults(needle, result);
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
			output[i].domain.id = addToDomainList(output[i].domain.name, output[i].domain.color);
		}
		return output;
	}

	var domains = new Array();
	function addToDomainList(domain, color){
		for(var i in domains){
			if(domains[i] == domain){
				return i;
			}
		}
		var output = domains.length;
		domains[output] = domain;
		return output;
	}

	m.getDomainId = function(domain){
		for(var i in domains){
			if(domains[i] == domain){
				return i;
			}
		}
	}

	function showResults(needle, results){
		if($("#searchBox").val() != needle) return;
		$("#y-searchResults").trigger("search", true);
		state = true;
		TermManager.clearTerms();
		DomainManager.clearDomains();
		SortManager.sortItems(result);
		loadResults(needle, results);
	}

    // loads the search results from the server and displays it
    // only loads the first 30 items for real-time result display (search as you type)
	function loadResults(needle, results){
		SortManager.sortItems(results);
        // deleting and re-adding is a rather inefficient way to sort
        // especially with all the cache created for the rows
		$("#y-searchResults").itemTable("clear");
		TermManager.clearTerms(true);
		DomainManager.clearDomains(true);
		StreamManager.clearStreams(true);
		for(var i=0; i<results.length; i++){
			if(i>30){ //load first 30 items first to prevent performance lag
				setTimeout(function(){ loadExtendedResults(needle, results); }, 1000);
				break;
			}
			var item = results[i];
			TermManager.addTerms(item.keywords);
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			StreamManager.addStream(item.stream);
			displayItem(i, item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
		$("#searchResults").itemTable("refreshTopRows");
	}

    // loads the rest of the result from the server query
	function loadExtendedResults(needle, results){
		if($("#searchBox").val() != needle) return;
		for(var i=30; i<results.length; i++){
			var item = results[i];
			TermManager.addTerms(item.keywords);
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			StreamManager.addStream(item.stream);
			displayItem(i, item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
		$("#y-searchResults").itemTable("refreshTopRows");
	}

	m.reload = function(){
		if(result.length == 0) return;
		SortManager.sortItems(result);
		loadResults(result);
	}

	function displayItem(id, item){
		item.id = id;
		TableHelper.addItem($("#y-searchResults"), item);
        $("#y-searchResults").itemTable("attach", {id: id});
	}

    // both public and private function? 
	m.antiSearch = antiSearch;
    // called when search is finished (going back to pivot mode)
	function antiSearch(){
		state = false;
		$("#y-searchResults").trigger("search", false);
	}

	var lastSearch = "";
	$(function(){
        $("#y-searchResults").bind("search", function(e, active){
            console.log("search", active);
            if(active){
                console.log("search: true");
                $("#y-searchResults").show();
            }else{
                $("#y-searchResults").hide();
            }
        });

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
