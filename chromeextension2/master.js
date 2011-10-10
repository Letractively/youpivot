var Master = {};

(function(){
    var m = Master;

    var tabs = {};
    var activeTab;

    m.addTab = function(id, obj, name, htmlfile){
        tabs[id] = {obj: obj, name: name};
        var attrid = "m-tabView_"+id;

        // create tab content view
        var div = $("<div />").addClass("m-tabViews").attr("id", attrid).load(htmlfile);
        $("#m-content").append(div.hide());

        // create tab button
        var img = "images/tab_default.png";
        if(typeof obj.tabImage == "function" && obj.tabImage())
            img = obj.tabImage();
        addTabHandle(id, name, img);

        // create topbar
        var topbar = $("<div />").attr("id", "m-topbar_"+id);
        $("#m-topbarContents").append(topbar.hide());
        if(typeof tabs[id].obj.populateTopbar == "function"){
            tabs[id].obj.populateTopbar(topbar);
        }
    }

    m.changeTab = function(id){
        if(activeTab)
            deactivateTab(activeTab);
        activateTab(id);
    }

    // create sidebar for the tab client (easier coding and more consistent style)
    m.createSidebar = function(id){
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
        handle.removeClass("selected");
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
        handle.addClass("selected");
        var view = $("#m-tabView_"+id);
        view.show();

        // show topbar
        $("#m-topbar_"+id).show();

        //$("#m-sidebarTitle").text(tabs[id].name);
    }

    function addTabHandle(id, name, img){
        var div = $("<div />").addClass("m-topTab").attr("id", "m-tab_"+id).html('<img src="'+img+'" class="m-tabimg"/><div class="m-tabname">'+name+'</div>');
        div.addClass("app");
        $("#m-topbarTabs").append(div).append('<div class="m-topTabDivider"/>');

        div.click(function(){
            m.changeTab(id);
        });

        div.mousedown(function(){
            $(this).addClass("active");
        }).mouseup(function(){
            $(this).removeClass("active");
        }).mouseout(function(){
            $(this).removeClass("active");
        });
    }
})();

$(function(){
	//initialize

    //create settings button
    var settings = $("<img />").attr("src", "images/tab_settings.png").addClass("m-tabimg");
    var btn = $("<a />").html(settings).attr("id", "m-settings").attr("href", chrome.extension.getURL("options/options.html"));
    $("#m-topbar").append(btn);
	
});
