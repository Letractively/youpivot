var Options = {};

(function(){
    var m = Options;

    m.onAttached = function(){
    }

    m.onDetached = function(){
    }

    m.populateTopbar = function(bar){
        // no topbar
    }

    m.tabImage = function(){
        return "images/tab_settings.png";
    }

    m.titleIcon = function(){
        return "images/titleicon_settings.png";
    }

    // initialization
    if(Master){
        // add the new tab
        Master.addTab("options", m, "Settings", "options/options.html");
        // change tab handle to the hear icon on the right
        Master.changeTabHandle("options", $("#m-settings"));

        // create sidebar
        var bar = Master.createSidebar("options");
        bar.attr("id", "o-leftSidebar");
        var div = $('<div id="leftSidebarContent"></div>');
        div.load("options/sidebar.html");
        bar.append(div);

        // make sure the tabs on the options page occupies the whole sidebar width
        bar.css("padding", 0);

        bar.find(".m-sidebarTitle").css("padding-right", "15px") // compensate for the 0 padding in the bar
            .children("span").text("Options"); // Change displayed page title
    }
})();

