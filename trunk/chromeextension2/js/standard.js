var O_O = {};

O_O.include = function(jsfile, baseurl){
    include(jsfile, baseurl);
}

O_O.style = function(cssfile){
    style(cssfile);
}

var _inclusions = {};
function include(jsfile, baseurl){
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

function pref(label){
	return PrefManager.getOption(label);
}

function debug_warn(message){
    if(_debug){
        alert(warn);
    }
    console.warn(message);
}

O_O.include("js/pref.js");

(function($){
    $.fn.view = function(){
        return this.data("view");
    }
})(jQuery);
