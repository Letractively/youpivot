include("/js/views/itemtable.js");
include("/traditional/js/historymodel.js");
include("/traditional/js/historylistitemfactory.js");

var HistoryList = new (function _HistoryList(){
    var self = this;

    var list = [];

    var showingDate = new Date().getTime();
    var dateSchema = {"left": "normal", "name": "normal"};

    self.changeDate = function(date){
        showingDate = date;
        populateHistoryList();
    }

    function populateHistoryList(){
        THDomainManager.clearDomains();
        self.itemTable.clear();
        HistoryModel.getDayVisits(showingDate, function(results){
            showResults(results, 0);
        }, 
        function(results){
            showResults(results, 100);
        });
        function showResults(results, start){
            list = results;
            for(var i=start; i<results.length; i++){
                displayVisit(results[i]);
                THDomainManager.addDomain("chrome://favicon/"+results[i].url, results[i].domain);
            }
            THDomainManager.display();
        }
    }

    self.getItem = function(id){
        for(var i in list){
            if(list[i].visitId == id){
                return list[i];
            }
        }
        return false;
    }

    var deleteentry = function(obj){
        var id = $(obj).data("id");
        self.itemTable.deleteItem(id);
        var item = self.getItem(id);
        // hack to remove only that one visit from history
        // chrome API mysteriously does not support that action
        chrome.history.deleteRange({startTime: item.visitTime-1, endTime: item.visitTime+1}, function(){
            console.log("history item deleted");
        });
    };

    function displayVisit(visit){
        var obj = {
            left    : HistoryListItemFactory.createLeft(visit),
            name    : HistoryListItemFactory.createName(visit),
            date    : HistoryListItemFactory.createDate(visit),
            id      : visit.visitId
        }

        var headerInfo = HistoryListItemFactory.createHeader(visit);
        var row = self.itemTable.addItem(obj, headerInfo);

        // don't add mouse event listeners if already added
        if(row === null) return null;

        var icon = IconFactory.createTextIcon("chrome://favicon/"+visit.url, visit.title, "item_icon");

        row.contextMenu("th_historylist_menu", {
            "Delete this entry": {
                click: deleteentry
            }
        }, 
        { title: icon + "<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+visit.title+"</div>" });

        row.data("id", visit.visitId); //store the item with the DOM object

        return row;
    }

    $(function(){
        self.itemTable = $("#th-historyList").itemTable(dateSchema);
        populateHistoryList();

        $("#th-historyList_older a").click(function(e){
            self.changeDate(showingDate - 86400000);
            e.preventDefault();
        });

        $("#th-historyList_newer a").click(function(e){
            self.changeDate(showingDate + 86400000);
            e.preventDefault();
        });

        $("#th-historyList_today a").click(function(e){
            self.changeDate(new Date().getTime());
            e.preventDefault();
        });

    });

})();