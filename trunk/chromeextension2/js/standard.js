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
}

function pref(label){
	return PrefManager.getOption(label);
}

include("js/pref.js");
