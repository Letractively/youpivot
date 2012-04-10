var Options = new (function _Options(){
    var self = this;

    // initialization
    self.init = function(){
        // add the new tab
        Master.addTab("options", self, "Settings", "options/options.html");
        // change tab handle to the hear icon on the right
        Master.changeTabHandle("options", $("#m-settings"));
    }

    self.onCreate = function(){
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

    self.onAttached = function(){
    }

    self.onDetached = function(){
    }

    self.populateTopbar = function(bar){
        // no topbar
    }

    self.titleIcon = function(){
        return "images/titleicon_settings.png";
    }
})();

