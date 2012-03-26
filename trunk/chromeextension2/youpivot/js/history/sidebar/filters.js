include("/js/filter.js");

var FilterManager = new (function _FilterManager(){
    var self = this;

    $(function(){
        self.filter = new Filter($("#filtersWrap"), ItemManager.getList);
        self.filter.addTestType("name", nameTest);
        self.filter.addTestType("domain", domainTest);
        self.filter.addTestType("stream", streamTest);
    });

    self.clearFilters = function(){
        self.filter.clearFilters();
    }
    
    $("#filtersWrap").bind("filterChanged", function(e, ids){
        TableManager.itemTable.filter(ids.include, ids.exclude);
        TableManager.itemTable.display();
    });

	function nameTest(value, item){
		return matchKeywords(value, item.keywords) || matchKeywords(value, item.title.split(/[^a-zA-Z0-9]/g));
	}
	function domainTest(domain, item){
		return item.domain.name == domain;
	}
	function streamTest(stream, item){
		return item.stream == stream;
	}

	function matchKeywords(needle, keywords){
		for(var i in keywords){
			if(keywords[i].toLowerCase().indexOf(needle.toLowerCase())!=-1){
				return true;
			}
		}
		return false;
	}

})();
