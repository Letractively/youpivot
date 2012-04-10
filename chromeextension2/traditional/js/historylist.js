include_("ItemTable");
include_("HistoryModel");
include_("HistoryListItemFactory");

var HistoryList = new (function _HistoryList(){
    var self = this;

    var list = [];
    var timeInterval = 43200000;
    self.itemsReady = true;

    var newestDate = new Date().getTime();
    var oldestDate = new Date().getTime() - (timeInterval-1);
    var dateSchema = {"left": "toprow", "name": "normal"};

    self.init = function(){
        self.itemTable = $("#th-historyList").itemTable2(dateSchema);
        populateHistoryList();

        $("#th-editButton").bind("togglechanged", function(e, state){
            if(state){
                $("head").append('<style id="th-showEditStyle">#th-historyList .edit { display: inline-block !important; }</style>');
            }else{
                $("#th-showEditStyle").remove();
            }

        });
    }

    function refreshDateBox(){
        THDateBoxController.setDate(oldestDate, newestDate);
    }

    self.setNewest = function(date, callback){
        oldestDate = date - (timeInterval-1);
        newestDate = date;
        refreshDateBox();
        populateHistoryList(callback);
        analytics("history navigation", "set newest", new Date(date).toString());
    }

    self.setOldest = function(date, callback){
        oldestDate = date;
        newestDate = date + (timeInterval-1);
        refreshDateBox();
        populateHistoryList(callback);
        analytics("history navigation", "set oldest", new Date(date).toString());
    }

    self.flipPage = function(fraction, maxFlipNumber){
        if(fraction > 0 && newestDate >= new Date().getTime()){
            console.log("no flipping needed");
            return;
        }
        self.itemsReady = false;
        var lastId = $("#th-historyList .item").last().attr("id");
        var firstId = $("#th-historyList .item").first().attr("id");
        var callback = (fraction > 0) ? flipUpCallback : flipDownCallback;
        self.setOldest(oldestDate + timeInterval * fraction, callback);
        function flipDownCallback(){
            var item = $("#th-historyList #"+lastId);
            if(maxFlipNumber && item.nextAll().length < 5){
                console.log("flip again");
                self.flipPage(fraction, maxFlipNumber-1);
            }
            if(item.length != 0){
                var offset = item.offset().top;
                //console.log("lastItem bottom space", $(document).outerHeight() - offset);
                $(document).scrollTop(offset - $(window).height() + 65);
            }else{
                console.log("item not found");
            }
            setTimeout(function(){
                self.itemsReady = true;
            }, 100);
        }

        function flipUpCallback(){
            var item = $("#th-historyList #"+firstId);
            if(maxFlipNumber && item.prevAll().length < 5){
                console.log("flip again");
                self.flipPage(fraction, maxFlipNumber-1);
            }
            if(item.length != 0){
                var offset = item.offset().top;
                //console.log("lastItem bottom space", $(document).outerHeight() - offset);
                $(document).scrollTop(offset - 65);
            }else{
                console.log("item not found");
            }
            setTimeout(function(){
                self.itemsReady = true;
            }, 100);
        }
    }

    function populateHistoryList(callback){
        HistoryModel.getNumVisits(oldestDate, newestDate, 1000, function(results){
            THDomainManager.clearDomains();
            THTermManager.clearTerms();
            self.itemTable.clear();

            if(results.length > 0){
                showResults(results);
                //newestDate = results[0].visitTime;
                //oldestDate = results[results.length-1].visitTime;
                $("#th-message").hide();
            }else{
                $("#th-message").html("No entries found between " + DateFormatter.formatDate(oldestDate, "M j ") + DateFormatter.formatTime(oldestDate, 12) + " and " + DateFormatter.formatDate(newestDate, "M j ") + DateFormatter.formatTime(newestDate, 12)).show();
            }
            if(callback)
                callback();
        });
    }

    self.showResults = function(results, start, count){
        THDomainManager.clearDomains();
        THTermManager.clearTerms();
        self.itemTable.clear();
        showResults(results, start, count);
    }

    function showResults(results, start, count){
        if(start === undefined || count === undefined){
            start = 0;
            count = 1000;
        }
        if(count == 0) throw "Count cannot be 0";

        //THFilterManager.filter.clearFilters();

        list = results;
        for(var i=start; i<start+count; i++){
            if(i >= results.length)
                break;
            displayVisit(results[i]);
            THDomainManager.addDomain("chrome://favicon/"+results[i].url, results[i].domain);
            THTermManager.addTerms(results[i].title.split(/[^a-zA-Z0-9]+/g));
        }
        THFilterManager.filter.triggerFilter();
        self.itemTable.display();
        THDomainManager.display();
        THTermManager.display();
        //setTimeout(function(){ showResults(results, start+count, count); }, 50); 
    }

    self.getList = function(){
        return list;
    }

    self.getItemIndex = function(id){
        for(var i in list){
            if(list[i].id == id){
                return i;
            }
        }
        return false;
    }

    self.getItem = function(id){
        var index = self.getItemIndex(id);
        if(index){
            return list[index];
        }else{
            return false;
        }
    }

    var deleteentry = function(obj){
        var id = $(obj).data("id"); // for context menu
        if(id === undefined) id = $(this).attr("data-id"); // for edit mode
        self.itemTable.deleteItem(id);
        var item = self.getItem(id);

        // hack to remove only that one visit from history
        // chrome API mysteriously does not support that action
        chrome.history.deleteRange({startTime: item.visitTime-1, endTime: item.visitTime+1}, function(){
            console.log("history item deleted");
            analytics("delete", "delete traditional history item");
        });

        delete list[self.getItemIndex(id)];
    };


    function displayVisit(visit){
        var MAXINT = Math.pow(2, 50);
        var obj = {
            left        : HistoryListItemFactory.createLeft(visit),
            name        : HistoryListItemFactory.createName(visit),
            date        : HistoryListItemFactory.createDate(visit),
            id          : visit.id,
            sortIndex   : (MAXINT - visit.visitTime)
        }

        var headerInfo = HistoryListItemFactory.createHeader(visit);
        self.itemTable.addItem(obj, headerInfo, function(row){
            var icon = IconFactory.createTextIcon("chrome://favicon/"+visit.url, visit.title, "item_icon");

            row.contextMenu("th_historylist_menu", {
                "Delete this entry": {
                    click: deleteentry
                }
            }, 
            { title: icon + "<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+visit.title+"</div>" });

            row.find(".deleteBtn").click(deleteentry);

            row.data("id", visit.id); //store the item with the DOM object
        });
    }

})();
