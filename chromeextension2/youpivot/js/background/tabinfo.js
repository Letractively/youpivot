/*** Class tabinfo ***/

function createTabInfo(cObj){
	var t = {};
	t.title = cObj.title;
	t.url = cObj.url;
	t.domain = cObj.domain;
	t.index = cObj.index;
	t.favUrl = cObj.favUrl;
	t.win = cObj.win;
	t.keywords = cObj.keywords;
	t.parentTab = cObj.parentTab;
	t.parentWindow = cObj.parentWindow;
	t.eid = -1;

	var obj = new TabInfo(t);
	return obj;
}

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
function TabInfo(t){
	var self = this;
	//General information
	self.title = t.title;
	self.url = t.url;
	self.domain = t.domain;
	self.favUrl = t.favUrl;
	self.index = t.index; //tab position index
	self.win = t.win; //window ID - unique within a browser session
	self.importance = 0.01;
	self.keywords = t.keywords; //JSON array of keywords in the page
	self.parentTab = t.parentTab; //index of the parent tab. This is unique only for the moment event when combined with parentWindow
	self.parentWindow = t.parentWindow; 
	self.eid = t.eid; //event id returned from server

	self.lastActive = 0; //the number of times getInfo is called after the last user input detected

	//one way flags - true if it is true for any instant after the last getInfo
	self.flags = {
		topTab: false, //top tab of the window
		focusTab: false, //top tab of the focused window
		focusWindow: false, //focused window
		opened: true //the tab is just opened
	};

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

	self.setFocus = function(tFocus, wFocus){
		//var wFocus = (focus.window == this.window);
		//var tFocus = (focus.index == this.index);
		self.lastActive = 0;
		if(wFocus){ self.flags["focusWindow"] = true; }
		if(tFocus){ self.flags["topTab"] = true; }
		if(wFocus && tFocus){ self.flags["focusTab"] = true; }
	}

	function compileOutput(){
		var output = {};
		for(var i in TabInfo_output){
			var key = TabInfo_output[i];
			output[key] = self[key];
		}
		return output;
	}

	self.getInfo = function(){
                if(TabInfo.debug) console.log("getInfo");
		calculateImportance();
		lowerFlags();
		self.lastActive++;
		var output = compileOutput();
		return output;
	}
}

/*** end class tabinfo ***/
