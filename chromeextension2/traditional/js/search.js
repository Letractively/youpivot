var THSearch = new (function _THSearch(){
    var self = this;

    var lastSearch = ""; // attempt to "synchronize" the results (not displaying if result is old)

    function displayResults(results, needle){
        if(needle != lastSearch)
            return;
        console.log(results);
    }

    function search(needle){
        if(needle == ""){
            antiSearch();
            return;
        }
        lastSearch = needle;
        chrome.history.search({text: needle, maxResults: 512}, function(results){
            displayResults(results, needle);
        });
    }

    function antiSearch(){
    }
    
    $(function(){
        $("#th-searchBox").keyup(function(){
            search($(this).val());
        });
    });
})();
