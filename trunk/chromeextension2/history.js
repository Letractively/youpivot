$(function(){
    // the order determines the order of the tabs on the left
    include("traditional.js");
    include("youpivot.js");
    include("timemarks.js");
    include("options.js");

    Master.changeTab("traditionalhistory");
});
