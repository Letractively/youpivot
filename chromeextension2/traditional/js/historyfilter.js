include_("Filter");

var THFilterManager = new (function _THFilterManager(){
    var self = this;

    self.init = function(){
        self.filter = new Filter($("#th-filtersWrap"), HistoryList.getList);
        self.filter.addTestType("domain", function(domain, item){
            return item.domain == domain;
        });
        self.filter.addTestType("term", function(term, item){
            return item.title.toLowerCase().indexOf(term) != -1;
        });
        $("#th-filtersWrap").bind("filterChanged", function(e, ids){
            HistoryList.itemTable.filter(ids.include, ids.exclude);
            HistoryList.itemTable.display();
        });
    }

})();
