include_("DomainExtractor");

/*** Class tabinfo ***/

// weights of the importance values
var TabInfo_weights = {
	topTab: 0.5, 
	focusTab: 0.2,
	focusWindow: 0.1, 
	opened: 0.3
};
var TabInfo_discounts = [1, 1, 1.2, 1.6, 2.0, false];
var TabInfo_maxImportance = 1.0;
var TabInfo_minImportance = 0.01;

var TabInfo_output = ["title", "url", "domain", "favUrl", "index", "win", "importance", "keywords", "parentTab", "parentWindow", "eid"];

//Object
function TabInfo(tab){
	var self = this;

	self.importance = 0.01;
	self.eid = -1; //event id returned from server
	self.lastActive = 0; //the number of times getInfo is called after the last user input detected

    (function init(tab){
        self.title = tab.title;
        self.url = tab.url;
        self.domain = DomainExtractor.getName(tab.url);
        self.favUrl = getFavUrl(tab, self.domain);
        self.index = tab.index; // tab position index
        self.win = tab.windowId; // window ID - unique within a browser session
        self.keywords = getKeywords(tab.title); // fallback
        self.parentTab = -1;
        self.parentWindow = -1;
    })(tab);

	//one way flags - true if it is true for any instant after the last getInfo
	self.flags = {
		topTab: false, //top tab of the window
		focusTab: false, //top tab of the focused window
		focusWindow: false, //focused window
		opened: true //the tab is just opened
	};

	self.setFocus = function(tFocus, wFocus){
		//var wFocus = (focus.window == this.window);
		//var tFocus = (focus.index == this.index);
		self.lastActive = 0;
		if(wFocus){ self.flags["focusWindow"] = true; }
		if(tFocus){ self.flags["topTab"] = true; }
		if(wFocus && tFocus){ self.flags["focusTab"] = true; }
	}

	self.getInfo = function(){
                if(TabInfo.debug) console.log("getInfo");
		calculateImportance();
		lowerFlags();
		self.lastActive++;
		var output = compileOutput();
		return output;
	}

	function getFavUrl(tab, domain){
		if(tab.favIconUrl){
			return tab.favIconUrl;
		}
		//use Google S2 if favicon URL is not defined
		var favIconUrl = "http://www.google.com/s2/favicons?domain="+domain;
		return favIconUrl;
	}

	// poor man's keyword generator
    // this is fallback method to create keywords when it's not extracted from the body text
	function getKeywords(title){
		title = title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, " ");
		var output = title.split(" ");
		for(var i in output){
			if(output[i].length==0)
				output.splice(i, 1);
		}
		return output;
	}

	function calculateImportance(){
                if(TabInfo.debug) console.log("calculateImportance");
		self.importance = 0;
		var discount = TabInfo_discounts[self.lastActive];
                if(TabInfo.debug) console.log("discount:", discount);
		if(!discount){
			self.importance = TabInfo.minImportance;
			return;
		}
		for(var i in self.flags){
			var value = (self.flags[i]) ? 1.0 : 0.0;
			var weight = TabInfo_weights[i];
			self.importance += (value*weight);
		}
		//cap the points before discounting
		if(self.importance > TabInfo_maxImportance) self.importance = TabInfo_maxImportance;
		self.importance /= discount;
                if(TabInfo.debug) console.log("importance:", self.importance);
	}

	function lowerFlags(){
		for(var i in self.flags){
			self.flags[i] = false;
		}
	}

	function compileOutput(){
		var output = {};
		for(var i in TabInfo_output){
			var key = TabInfo_output[i];
			output[key] = self[key];
		}
		return output;
	}
}

/*** end class tabinfo ***/
