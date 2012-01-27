var IconFactory = new (function _IconFactory(){
    var self = this;

	self.createFavicon = function(url, name){
		if(!name) name = url;
		return self.createIcon(getFavicon(url), name);
	}

	function getFavicon(url){
		return "chrome://favicon/"+url;
	}

	self.createIcon = function(src, name){
		var output;
		output = $(self.createTextIcon(src, name));
		return output;
	}

	self.createTextIcon = function(src, name, clss){
		var classString = (clss) ? clss : "";
		if(!name) name = src;
		var error = (src) ? "onerror='this.src=\""+getFavicon(src)+"\"'" : "";
		var img = "<img src='"+src+"' title='"+name+"' "+error+" class='favicon "+classString+"' />";
		return img;
	}
})();
