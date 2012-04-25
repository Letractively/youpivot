include_("jQuery");
//include_("Connector");

/***
  
  Library of standard functions used to build this JavaScript programming model. 
  
  - include_(name)
    Signals that the calling javascript files requires another JavaScript file. It checks for whether the necessary file is there by looking at the "name" attribute of all the <script> tags in the HTML. 
    <String> name - name of the JavaScript file that is dependent upon

  - style_(name) [not yet functioning]
    Signals that the calling javascript file requires support of a CSS file. Works the same way as include_(name)

  - include(jsfile) [Deprecated]
    Old version of include which does not need <script> tag. Deprecated because this obscures the debug trace and reduces performance. 

  - style(cssfile)

  - debug_warn(message, extra)
    Convenience function for console.warn(message, extra). 
    Additionally give an alert(message) if in debug mode (i.e. loaded from unpacked extension)

  - analytics(category, action, label, value, nonInteraction)
    <String>    category - Highest level label in Google Analytics
    <String>    action - Second level label in Google Analytics
    <String>    label - Lowest level label in Google Analytics
    <Int>       value - Integer value assocaited to the event
    <Boolean>   nonInteraction - whether this event affects the bounce rate (See Analytics docs for more info)

***/

// Globals
var _checkProvides = 5000;
var _inclusions = {};
var _debug = (chrome.extension.getURL("/") != "chrome-extension://bhojlafenkipmbhpfhoojcflnplpohoo/");

function include_(name){
    //include(jsfile, baseurl);
    var script = $("script[name="+name+"]");
    if(script.length == 0){
        debug_warn(name + " is not provided");
    }else{
        script.attr("data-included", true);
        //console.log("included "+name);
    }
}

function style_(cssfile){
    //style(cssfile);
}

$(function(){
    // check integrity of scripts
    if(_checkProvides){
        setTimeout(function(){
            // check if provides are used
            $("script").each(function(){
                var sName = $(this).attr("name");
                if(!sName || sName == ""){
                    console.log("illegal script tag", $(this));
                }else{
                    if(!$(this).attr("data-included")){
                        console.log("provide " + sName + " is not used");
                    }
                }
            });
        }, _checkProvides);
    }
});

function include(jsfile, baseurl){
    console.trace();
    var url;
    if(baseurl){
        url = baseurl + jsfile;
    }else{
        url = jsfile;
    }
    // double inclusion guard
    if(!_inclusions[url]){
        _inclusions[url] = true;
        $.ajaxSetup({async: false});
        $.getScript(url);
        $.ajaxSetup({async: true});
    }
}

function style(cssfile){
    var css = $('<link rel="stylesheet" href="'+cssfile+'" />');
    $("head").append(css);
    return css;
}

function debug_warn(message, extra){
    if(_debug){
        alert(message);
    }
    console.warn(message, extra);
    console.trace();
}

function analytics(section, name, infos, eid, importance){
    console.log("analytics", arguments);

    if(!pref("logging"))
        return;

    var keywords = [];
    var k = 0;
    for(var i in infos){
        keywords[k++] = i + " : " + infos[i];
    }
    
    var item = {
        "title": name,
        "url": "#log",
        "eventtypename": section,
        "favicon": chrome.extension.getURL("/images/analytics.png"),
        "keyword": keywords,
        "starttime": Math.floor(new Date().getTime()/1000),
        "endtime": Math.floor(new Date().getTime()/1000 + 1),
        "stream": "analytics",
        "color": "#CCCCCC",
    };

    if(eid && importance){
        item.time0 = Math.floor(new Date().getTime()/1000);
        item.val0 = importance;
    }

    Connector.send("add", item);
    /*
    if(analyticsReady){
        //_gaq.push(['_trackEvent', category, action, label, value, nonInteraction]);
    }else{
        console.log("Analytics not ready");
    }
    */
}

(function($){
    $.fn.view = function(){
        return this.data("view");
    }
})(jQuery);
