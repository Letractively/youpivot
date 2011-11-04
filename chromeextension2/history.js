include("/js/urlhash.js");

$(function(){
    // the order determines the order of the tabs on the left
    include("traditional.js");
    include("youpivot.js");
    include("timemarks.js");
    include("options.js");

    // get the hash value before Master.changeTab changes it
    var hashTab = URLHash.getHashValue("tab");

    Master.changeTab("traditionalhistory");

    if(typeof hashTab == "string")
        Master.changeTab(hashTab);

	//listen for hash change
    URLHash.onHashValueChange("tab", function(tabId){
        Master.changeTab(tabId);
    });
});
