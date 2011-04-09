var IconFactory = {};

(function(){
	var m = IconFactory;

	m.createFavicon = function(url, name){
		if(!name) name = url;
		return this.createIcon(getFavicon(url), name);
	}

	function getFavicon(url){
		return "chrome://favicon/"+url;
	}

	m.createIcon = function(src, name){
		var output;
		output = $(m.createTextIcon(src, name));
		return output;
	}

	m.createTextIcon = function(src, name, clss){
		var classString = (clss) ? clss : "";
		if(!name) name = src;
		var img = "<img src='"+src+"' title='"+name+"' class='favicon "+classString+"' />";
		return img;
	}
})();
