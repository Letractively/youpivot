include("youpivot/js/history/helpers/pivottable.js");
include("js/keytable.js");

var SearchManager = {};

(function(){
	var m = SearchManager;

    m.results = new KeyTable();

	var state = false; //is search currently in use
    var itemTable;

    /********* Transitional functions **************/

    m.hide = function(obj, className){
        itemTable.hide(obj, className);
    }
    m.show = function(obj, className){
        itemTable.show(obj, className);
    }

    m.hideAll = function(className){
        itemTable.hideAll(className);
    }

    m.refreshTopRows = function(){
        itemTable.refreshTopRows();
    }

    m.highlight = function(id, level){
        var item = m.results[id];
        if(!item) return;
        itemTable.highlight(id, item.domain.color, level);
    }
    m.lowlight = function(id){
        var item = m.results[id];
        if(!item) return;
        itemTable.lowlight(id, item.domain.color);
    }

    m.getDomainId = function(title){
        for(var i in m.results){
            if(m.results[i].domain.name == title)
                return m.results[i].domain.id;
        }
        return -1;
    }

    /********* end transitional functions ***********/

    m.init = function(){
        itemTable = $("#y-searchResults").pivotTable();
    }

	m.getState = function(){
		return state;
	}

	m.changeSchema = function(sortBy){
        itemTable.resetToSortMode(sortBy);
        m.reload();
	}

	function search(needle){
		if(needle==""){ antiSearch(); return; }
		needle = needle.toLowerCase(); //change to lower case as the search algorithm is also changed to lower case (for case insensitiveness)
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

	function showResults(needle, result){
		if($("#searchBox").val() != needle) return;
		$("#y-searchResults").trigger("search", true);
		state = true;
		TermManager.clearTerms();
		DomainManager.clearDomains();
		SortManager.sortItems(m.results);
		loadResults(needle, result);
	}

    // loads the search results from the server and displays it
    // only loads the first 30 items for real-time result display (search as you type)
	function loadResults(needle, results){
		SortManager.sortItems(results);
        itemTable.clear();
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
            item.id = i;
            m.results[i] = item;
			displayItem(item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
        itemTable.refreshTopRows();
	}

    // loads the rest of the result from the server query
	function loadExtendedResults(needle, results){
		if($("#searchBox").val() != needle) return;
		for(var i=30; i<results.length; i++){
			var item = results[i];
			TermManager.addTerms(item.keywords);
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			StreamManager.addStream(item.stream);
            item.id = i;
            m.results[i] = item;
			displayItem(item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
        itemTable.refreshTopRows();
	}

	function loadSortedResults(){
        itemTable.clear();
        m.results.iterate(function(item){
			displayItem(item);
		});
        itemTable.refreshTopRows();
	}

	m.reload = function(){
		SortManager.sortItems(m.results);
		loadSortedResults();
	}

    var mouseenterrow = function(){
        HighlightManager.mouseEnterSearchTableItem($(this).data("id"));
    };
    var mouseleaverow = function(){
        //TODO: use related target to minimize calculation
        HighlightManager.mouseLeaveSearchTableItem($(this).data("id"));
    };
    var deleteentry = function(obj){
        var id = $(obj).data("id");
        itemTable.deleteItem(id);
        Connector.send("delete", {eventid: m.results[id].eventId}, {
            onSuccess: function(data){
                console.log("item deleted -- ", data);
            }, 
            onError: function(data){
                console.log("item delete error -- ", data);
            }
        });
        var item = ItemManager.getItemByEventId(m.results[id].eventId);
        ItemManager.deleteItem(item.id);
    };

	function displayItem(item){
        var row = itemTable.addItem(item);
        if(row === null) return;

		//add mouseover events
		row.mouseenter(mouseenterrow);
		row.mouseleave(mouseleaverow);
		var icon = IconFactory.createTextIcon(item.domain.favUrl, item.title, "item_icon");
		row.contextMenu("table_menu", {
			"Delete this entry": {
				click: deleteentry
			}
		}, 
		{ title: icon+"<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+item.title+"</div>" });
	}

    // both public and private function? 
    m.antiSearch = function(){
        $("#searchBox").val("");
        antiSearch();
    }
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
