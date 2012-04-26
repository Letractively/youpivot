include("/js/filter.js");

var TMFilterManager = new (function _TMFilterManager(){
    var self = this;

    $(function(){
        self.filter = new Filter($("#tm-filtersWrap"), function(){ return $(".entry");});
        
        self.filter.addTestType("domain", function(domain, item){
            console.log($(item).data('domain'));
            return $(item).data('domain') == domain;
        });
        self.filter.addTestType("label", function(term, item){
            return item.title.toLowerCase().indexOf(term) != -1;
        });
        $("#tm-filtersWrap").bind("filterChanged", function(e, ids){
            TimeMarkList.itemTable.filter(ids.include, ids.exclude);
            TimeMarkList.itemTable.display();
        });
    });

})();
