include("youpivot/js/history/helpers/tablerowfactory.js");

var SearchManager = {};

(function(){
	var m = SearchManager;
	var result = [];
	var state = false; //is search currently in use
    var itemTable;

    /********* Transitional functions **************/
    var sr = $("#y-searchResults");

    m.hideAll = function(className){
        itemTable.hideAll(className);
    }

    m.refreshTopRows = function(){
        itemTable.refreshTopRows();
    }

    m.highlight = function(id, level){
        var row = $("#y-searchResults #item_"+id);
        if(row.length == 0) return;
        var item = result[id];
        if(!item) return;
        var color = item.domain.color;
        row.css("background-color", Helper.createLighterColor(color, PrefManager.getOption(level+"Bg")));
        var fgColor = Helper.createLighterColor(color, PrefManager.getOption(level+"Fg")); //foreground color
        $(".item_color", row).css("background-color", fgColor);
    }
    m.lowlight = function(id){
        var row = $("#y-searchResults #item_"+id);
        if(row.length == 0) return;
        var item = result[id];
        if(!item) return;
        var color = item.domain.color;
        row.css("background-color", "");
        $(".item_color", row).css("background-color", Helper.createLighterColor(color, PrefManager.getOption("lowlightFg")));
    }

    /********* end transitional functions ***********/

	var dateSchema = {"left": "normal", "color": "normal", "name": "normal"};
	var typeSchema = {"date": "toprow", "left": "normal", "color": "normal", "name": "normal"};

    m.init = function(){
        itemTable = $("#y-searchResults").itemTable(dateSchema);
    }

	m.getState = function(){
		return state;
	}

	m.changeSchema = function(sortBy){
        console.log("change schema");
		var schema = dateSchema;
		if(sortBy=="by type") schema = typeSchema;
        else if(sortBy=="chronological") schema = dateSchema;
        itemTable.destroy();
        $("#y-searchResults").itemTable(schema);
        m.reload();
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
			displayItem(i, item);
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
			displayItem(i, item);
		}
		TermManager.display();
		DomainManager.display();
		StreamManager.display();
        itemTable.refreshTopRows();
	}

	m.reload = function(){
		if(result.length == 0) return;
		SortManager.sortItems(result);
		loadResults(result);
	}

    var mouseenterrow = function(){
        HighlightManager.mouseEnterSearchTableItem($(this).data("id"));
        $(".item_time", this).hide();
        $(".pivotBtn", this).show();
    };
    var mouseleaverow = function(){
        //TODO: use related target to minimize calculation
        HighlightManager.mouseLeaveSearchTableItem($(this).data("id"));
        $(".item_time", this).show();
        $(".pivotBtn", this).hide();
    };
    var deleteentry = function(obj){
        var id = $(obj).data("id");
        itemTable.deleteItem(id);
        Connector.send("delete", {eventid: ItemManager.list[id].eventId}, {
            onSuccess: function(data){
                console.log("item deleted -- ", data);
            }, 
            onError: function(data){
                console.log("item delete error -- ", data);
            }
        });
        ItemManager.deleteItem(id);
        //throw "delete entry is not implemented yet";
    };

	function displayItem(id, item){
		item.id = id;
		var obj = {};
		obj.left = TableRowFactory.createLeft(item);
		obj.color = "";
		obj.name = TableRowFactory.createName(item);
		obj.date = TableRowFactory.createDate(item);
		obj.id = item.id;
		var headerInfo = TableRowFactory.createHeader(item);
        var row = itemTable.addItem(obj, headerInfo);

        if(row === null) return;

		//set link to pivot if it is a timemark
		if(item.domain.name == "timemark"){
			row.find(".item_name a").click(function(e){
				PivotManager.pivotItem(item.eventId);
				e.preventDefault();
			});
		}
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
		row.data("id", item.id); //store the item with the DOM object
		//row.addClass("item_domain_"+item.domain.id);
        var item = ItemManager.getItem(item.id);
        row.find(".item_color").css("background-color", Helper.createLighterColor(item.domain.color, PrefManager.getOption("lowlightFg")));
        row.find(".pivotBtn").click(function(){
            PivotManager.pivotItem(item.eventId);
        });
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
