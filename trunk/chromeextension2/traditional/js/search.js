var THSearch = new (function _THSearch(){
    var self = this;

    var lastSearch = ""; // attempt to "synchronize" the results (not displaying if result is old)
    var NUMRESULTS = 1000;

    function displayResults(results, needle){
        if(needle != lastSearch)
            return;
        HistoryList.showResults(results, 0, NUMRESULTS);
        console.log(needle);
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
        HistoryList.setNewest(new Date().getTime());
    }
    
    var REFRACTORYPERIOD = 300;
    var timer = 0;
    $(function(){
        $("#th-searchBox").keyup(function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                search($("#th-searchBox").val());
            }, REFRACTORYPERIOD);
        });
    });
})();
