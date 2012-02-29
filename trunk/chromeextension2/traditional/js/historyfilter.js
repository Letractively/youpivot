include("/js/filter.js");

var THFilterManager = new (function _THFilterManager(){
    var self = this;

    $(function(){
        self.filter = new Filter($("#th-filtersWrap"), HistoryList.getList);
        self.filter.addTestType("domain", function(domain, item){
            return item.domain == domain;
        });
        $("#th-filtersWrap").bind("filterChanged", function(e, ids){
            HistoryList.itemTable.filter(ids.include, ids.exclude);
            HistoryList.itemTable.display();
        });
    });

})();
