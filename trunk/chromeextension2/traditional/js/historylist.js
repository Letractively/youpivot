include("/js/views/itemtable2.js");
include("/traditional/js/historymodel.js");
include("/traditional/js/historylistitemfactory.js");

var HistoryList = new (function _HistoryList(){
    var self = this;

    var list = [];
    var timeInterval = 86400000;

    var newestDate = new Date().getTime();
    var oldestDate = new Date().getTime() - (timeInterval-1);
    var dateSchema = {"left": "toprow", "name": "normal"};

    self.setNewest = function(date){
        oldestDate = date - (timeInterval-1);
        newestDate = date;
        populateHistoryList();
    }

    self.setOldest = function(date){
        oldestDate = date;
        newestDate = date + (timeInterval-1);
        populateHistoryList();
    }

    function populateHistoryList(){
        THDomainManager.clearDomains();
        self.itemTable.clear();
        HistoryModel.getNumVisits(oldestDate, newestDate, 1000, function(results){
            if(results.length > 0){
                showResults(results);
                newestDate = results[0].visitTime;
                oldestDate = results[results.length-1].visitTime;
                $("#th-message").hide();
            }else{
                $("#th-message").html("No entries found between " + DateFormatter.formatDate(oldestDate, "M j ") + DateFormatter.formatTime(oldestDate, 12) + " and " + DateFormatter.formatDate(newestDate, "M j ") + DateFormatter.formatTime(newestDate, 12)).show();
            }
        });
    }

    function showResults(results, start, count){
        if(start === undefined || count === undefined){
            start = 0;
            count = 1000;
        }
        if(count == 0) throw "Count cannot be 0";

        list = results;
        for(var i=start; i<start+count; i++){
            if(i >= results.length)
                break;
            displayVisit(results[i]);
            THDomainManager.addDomain("chrome://favicon/"+results[i].url, results[i].domain);
        }
        self.itemTable.display();
        THDomainManager.display();
        //setTimeout(function(){ showResults(results, start+count, count); }, 50); 
    }

    self.getList = function(){
        return list;
    }

    self.getItemIndex = function(id){
        for(var i in list){
            if(list[i].visitId == id){
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
        });

        delete list[self.getItemIndex(id)];
    };


    function displayVisit(visit){
    var MAXINT = Math.pow(2, 50);
        var obj = {
            left        : HistoryListItemFactory.createLeft(visit),
            name        : HistoryListItemFactory.createName(visit),
            date        : HistoryListItemFactory.createDate(visit),
            id          : visit.visitId,
            sortIndex   : (MAXINT - visit.visitTime) * 2
        }

        var headerInfo = HistoryListItemFactory.createHeader(visit);
        self.itemTable.batchAddItem(obj, headerInfo, function(row){
            var icon = IconFactory.createTextIcon("chrome://favicon/"+visit.url, visit.title, "item_icon");

            row.contextMenu("th_historylist_menu", {
                "Delete this entry": {
                    click: deleteentry
                }
            }, 
            { title: icon + "<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+visit.title+"</div>" });

            row.find(".deleteBtn").click(deleteentry);

            row.data("id", visit.visitId); //store the item with the DOM object
        });
    }

    $(function(){
        self.itemTable = $("#th-historyList").itemTable2(dateSchema);
        populateHistoryList();

        $("#th-historyList_older a").click(function(e){
            self.setNewest(oldestDate - 1);
            e.preventDefault();
        });

        $("#th-historyList_newer a").click(function(e){
            self.setOldest(newestDate + 1);
            e.preventDefault();
        });

        $("#th-historyList_today a").click(function(e){
            self.setNewest(new Date().getTime());
            e.preventDefault();
        });

        $("#th-editButton").bind("togglechanged", function(e, state){
            if(state){
                $("#th-historyList .edit").show();
            }else{
                $("#th-historyList .edit").hide();
            }

        });
    });

})();
