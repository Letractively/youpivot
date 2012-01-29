var Popup = new (function _Popup(){
    var self = this;

    var colors = {'red': "#BC0019", 'black': "#282828", 'blue': "#116CC1", 'darkBlue': "#0A28A4", 'darkGreen': "#0C4811", 'green': "#21AB18", 'orange': "#BE6B0C", 'purple': "#50009B", 'silver': "#6B6B6B", 'yellow': "#C0B80D"};

    $(function(){
        makeNavButton("Make a TimeMark", "#", undefined).addClass("selected");
        makeNavButton("TimeMarks", chrome.extension.getURL("history.html#tab=timemarks"), undefined);
        makeNavButton("Web History", chrome.extension.getURL("history.html#tab=traditionalhistory"), undefined);
        makeNavButton("YouPivot History", chrome.extension.getURL("history.html#tab=youpivot"), undefined);

        $("#maketimemark").submit(submitForm);
        $("#popup_timemark_color").bind("selectionChanged", function(e, newValue){
            setLabelText(getLabelName(newValue), colors[newValue]);
        });
        $("#popup_cancel").click(function(){ window.close(); });
        $(document).keydown(function(){
            $("#popup_input").focus();
        });
    });

    function makeNavButton(label, href, action){
        var btn = $("<a />").addClass("popup_nav_button")
                            .html(label)
                            .attr("href", href)
                            .attr("target", "_blank")
                            .click(action);
        $("#popup_nav").append(btn);
        return btn;
    }

    function submitForm(){
        //get the description
        var description = $("#popup_input").val();
        var color = $("#popup_timemark_color").view().getValue();

        chrome.extension.sendRequest({
            'action' : 'addTimeMark',
            'description': description,
            'color' : color
        },function(response){
            $("#popup_notice").text("TimeMark added!");
            setTimeout(function(){ window.close(); }, 1500);
        });

        $("#popup_input").val(""); // clear text box
        return false;
    }

    function getLabelName(color){
        var labels = window.localStorage['labels'];
        if(labels == undefined){
            labels = {'red': "", 'black': "", 'blue': "", 'darkBlue': "", 'darkGreen': "", 'green': "", 'orange': "", 'purple': "", 'silver': "", 'yellow': ""};
        }else{
            labels = JSON.parse(labels, null);
        }
        return (!labels[color] || labels[color] == "") ? color : labels[color];
    }

    function setLabelText(text, color){
        if(text==undefined || text.length==0){
            $("#popup_timemark_label").hide();
        }else{
            $("#popup_timemark_label").show();
            $("#popup_timemark_label").html("This is a <font style='font-weight: bold; color: "+color+"'>" + text + "</font> TimeMark");
        }
    }

})();
