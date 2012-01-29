include("/js/urlhash.js");

var Master = new (function _Master(){
    var self = this;

    var tabs = {};
    var activeTab;

    self.addTab = function(id, obj, name, htmlfile){
        tabs[id] = {obj: obj, name: name};
        var attrid = "m-tabView_"+id;

        // create tab content view
        var div = $("<div />").addClass("m-tabViews").attr("id", attrid).load(htmlfile, function(){
            $("#m-tabView_"+id).trigger("tabready");
        });
        $("#m-content").append(div.hide());

        // create tab button
        addTabHandle(id, name);

        // create topbar
        var topbar = $("<div />").attr("id", "m-topbar_"+id);
        $("#m-topbarContents").append(topbar.hide());
        if(typeof tabs[id].obj.populateTopbar == "function"){
            tabs[id].obj.populateTopbar(topbar);
        }
    }

    self.changeTab = function(id){
        if(tabs[id] === undefined) return;
        if(activeTab)
            deactivateTab(activeTab);
        activateTab(id);
        URLHash.setHash("tab", id);
    }

    self.changeTabHandle = function(id, newHandle){
        $("#m-tab_"+id).next().remove();
        $("#m-tab_"+id).remove();
        newHandle.attr("id", "m-tab_"+id);
        
        newHandle.click(function(){
            self.changeTab(id);
        });

        newHandle.mousedown(function(){
            $(this).addClass("pressed");
        }).mouseup(function(){
            $(this).removeClass("pressed");
        }).mouseout(function(){
            $(this).removeClass("pressed");
        });
    }

    // create sidebar for the tab client (easier coding and more consistent style)
    self.createSidebar = function(id){
        var tabView = $("#m-tabView_"+id);
        tabView.children().css("margin-left", "280px");

        // create the large icon that Josh wants so badly
        var obj = tabs[id].obj;
        var icon = "";
        if(typeof obj.titleIcon == "function")
            var icon = '<img src="'+obj.titleIcon()+'" class="m-sidebarTitleIcon" />';

        var bar = $("<div />").addClass("m-leftSidebar");
        bar.html('<div class="m-sidebarTitle">'+icon+'<span>'+tabs[id].name+'</span>'+'</div>');
        tabView.prepend(bar);
        return bar;
    }

    function deactivateTab(id){
        var handle = $("#m-tab_"+id);
        handle.removeClass("active");
        var view = $("#m-tabView_"+id);
        view.hide();

        // hide topbar
        $("#m-topbar_"+id).hide();
        
        // call "destructor"
        if(typeof tabs[id].obj.onDetached == "function"){
            tabs[id].obj.onDetached();
        }
    }

    function activateTab(id){
        // call "constructor"
        if(typeof tabs[id].obj.onAttached == "function"){
            tabs[id].obj.onAttached();
        }

        activeTab = id;
        var handle = $("#m-tab_"+id);
        handle.addClass("active");
        var view = $("#m-tabView_"+id);
        view.show();

        // show topbar
        $("#m-topbar_"+id).show();

        //$("#m-sidebarTitle").text(tabs[id].name);
    }

    function addTabHandle(id, name){
        var div = $("<div />").addClass("m-topTab").attr("id", "m-tab_"+id).html('<div class="m-tabimg"></div><div class="m-tabname">'+name+'</div>');
        div.addClass("app");
        $("#m-topbarTabs").append(div).append('<div class="m-topTabDivider"/>');

        div.click(function(){
            self.changeTab(id);
        });

        div.mousedown(function(){
            $(this).addClass("pressed");
        }).mouseup(function(){
            $(this).removeClass("pressed");
        }).mouseout(function(){
            $(this).removeClass("pressed");
        });
    }
})();

$(function(){
	//initialize

    //create settings button
    var settings = $("<img />").attr("src", "images/tab_settings.png").addClass("m-tabimg");
    var btn = $("<div />").html(settings).attr("id", "m-settings").css("float", "right");
    $("#m-topbar").prepend(btn);
	
});
