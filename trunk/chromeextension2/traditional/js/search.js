var THSearch = new (function _THSearch(){
    var self = this;

    var lastSearch = ""; // attempt to "synchronize" the results (not displaying if result is old)
    var NUMRESULTS = 300;
    
    var REFRACTORYPERIOD = 300;
    var timer = 0;
    self.init = function(){
        $("#th-searchBox").keyup(function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                search($("#th-searchBox").val());
            }, REFRACTORYPERIOD);
        }).click(function(){
            if(lastSearch.length > 0 && $(this).val()==""){
                search("");
            }
        });
    }

    function displayResults(results, needle){
        if(needle != lastSearch)
            return;
        THFilterManager.filter.clearFilters();
        HistoryList.showResults(results, 0, NUMRESULTS);
        console.log(needle);
        analytics("Traditional History", "Search: "+needle, {action: "search", needle: needle});
    }

    function search(needle){
        if(needle == ""){
            antiSearch();
            return;
        }
        lastSearch = needle;
        HistoryModel.searchVisits(needle, NUMRESULTS, function(results){
            displayResults(results, needle);
        });
    }

    function antiSearch(){
        console.log("antiSearch");
        HistoryList.setNewest(new Date().getTime());
    }
})();
