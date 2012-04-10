include_("URLHash");
include_("TimeMarks");
include_("Options");
include_("TraditionalHistory");
include_("YouPivot");

$(function(){
    // the order determines the order of the tabs on the left
    TraditionalHistory.init();
    YouPivot.init();
    TimeMarks.init();
    Options.init();

    // get the hash value before Master.changeTab changes it
    var hashTab = URLHash.getHashValue("tab");

    if(typeof hashTab == "string")
        Master.changeTab(hashTab);
    else
        Master.changeTab(pref("defaultTab"));

	//listen for hash change
    URLHash.onHashValueChange("tab", function(tabId){
        Master.changeTab(tabId);
    });
});
