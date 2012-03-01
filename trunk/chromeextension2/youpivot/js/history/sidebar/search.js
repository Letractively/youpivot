include("/js/iconfactory.js");
include("youpivot/js/history/helpers/pivottable.js");
include("js/keytable.js");

var SearchManager = new (function _SearchManager(){
    var self = this;

    self.results = new KeyTable();

	var state = false; //is search currently in use
    var itemTable;

    /********* Transitional functions **************/

    self.hide = function(obj, className){
        itemTable.hide(obj, className);
    }
    self.show = function(obj, className){
        itemTable.show(obj, className);
    }

    self.refreshTopRows = function(){
        itemTable.refreshTopRows();
    }

    self.highlight = function(id, level){
        var item = self.results[id];
        if(!item) return;
        itemTable.highlight(id, item.domain.color, level);
    }
    self.lowlight = function(id){
        var item = self.results[id];
        if(!item) return;
        itemTable.lowlight(id, item.domain.color);
    }

    self.getDomainId = function(title){
        for(var i in self.results){
            if(self.results[i].domain.name == title)
                return self.results[i].domain.id;
        }
        return -1;
    }

    /********* end transitional functions ***********/

    var lastSearch = "";
    self.init = function(){
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

        itemTable = $("#y-searchResults").pivotTable();

        $("#yp-editButton").bind("togglechanged", function(e, state){
            if(SearchManager.getState()){
                if(state){
                    $("head").append('<style id="searchEditStyle">#y-searchResults .edit { display: inline-block !important; }</style>');
                    //$("#y-searchResults .edit").show();
                }else{
                    $("#searchEditStyle").remove();
                    //$("#y-searchResults .edit").hide();
                }
            }
        });
    }

	self.getState = function(){
		return state;
	}

	self.changeSchema = function(sortBy){
        itemTable.resetToSortMode(sortBy);
        self.reload();
	}

    self.getItem = function(id){
        return self.results[id];
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

	self.getDomainId = function(domain){
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
		SortManager.sortItems(self.results);
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
            self.results[i] = item;
			displayItem(item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
        itemTable.display();
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
            self.results[i] = item;
			displayItem(item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
        itemTable.display();
	}

	function loadSortedResults(){
        itemTable.clear();
        self.results.iterate(function(item){
			displayItem(item);
		});
        itemTable.display();
	}

	self.reload = function(){
		SortManager.sortItems(self.results);
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
        if(id === undefined)
            id = $(this).attr("data-id"); // for edit mode
        itemTable.deleteItem(id);
        Connector.send("delete", {eventid: self.results[id].eventId}, {
            onSuccess: function(data){
                console.log("item deleted -- ", data);
            }, 
            onError: function(data){
                console.log("item delete error -- ", data);
            }
        });
        self.results.remove(id);
        //var item = ItemManager.getItemByEventId(self.results[id].eventId);
        //ItemManager.deleteItem(item.id);
        itemTable.display();
    };

	function displayItem(item){
        var row = itemTable.addItem(item, function(row){
            //add mouseover events
            row.mouseenter(mouseenterrow);
            row.mouseleave(mouseleaverow);
            var icon = IconFactory.createTextIcon(item.domain.favUrl, item.title, "item_icon");
            row.contextMenu("searchtable_menu", {
                "Delete this entry": {
                    click: deleteentry
                }
            }, 
            { title: icon+"<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+item.title+"</div>" });
            row.find(".deleteBtn").click(deleteentry);
        });
	}

    // both public and private function? 
    self.antiSearch = function(){
        $("#searchBox").val("");
        antiSearch();
    }
    // called when search is finished (going back to pivot mode)
	function antiSearch(){
		state = false;
		$("#y-searchResults").trigger("search", false);
	}
})();
