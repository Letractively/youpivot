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

var TabInfo_output = ["title", "url", "domain", "favUrl", "index", "win", "importance", "keywords", "parentTab", "parentWindow"];

//Object
function TabInfo(t){
	var ti = this;
	//General information
	this.title = t.title;
	this.url = t.url;
	this.domain = t.domain;
	this.favUrl = t.favUrl;
	this.index = t.index; //tab position index
	this.win = t.win; //window ID - unique within a browser session
	this.importance = 0.01;
	this.keywords = t.keywords; //JSON array of keywords in the page
	this.parentTab = t.parentTab; //index of the parent tab. This is unique only for the moment event when combined with parentWindow
	this.parentWindow = t.parentWindow; 
	this.eid = t.eid; //event id returned from server

	this.lastActive = 0; //the number of times getInfo is called after the last user input detected

	//one way flags - true if it is true for any instant after the last getInfo
	this.flags = {
		topTab: false, //top tab of the window
		focusTab: false, //top tab of the focused window
		focusWindow: false, //focused window
		opened: true //the tab is just opened
	};

	function calculateImportance(){
		ti.importance = 0;
		var discount = TabInfo_discounts[ti.lastActive];
		if(!discount){
			ti.importance = TabInfo.minImportance;
			return;
		}
		for(var i in ti.flags){
			var value = (ti.flags[i]) ? 1.0 : 0.0;
			var weight = TabInfo_weights[i];
			ti.importance += (value*weight);
		}
		//cap the points before discounting
		if(ti.importance > TabInfo_maxImportance) ti.importance = TabInfo_maxImportance;
		ti.importance /= discount;
	}

	function lowerFlags(){
		for(var i in ti.flags){
			ti.flags[i] = false;
		}
	}

	this.setFocus = function(tFocus, wFocus){
		//var wFocus = (focus.window == this.window);
		//var tFocus = (focus.index == this.index);
		ti.lastActive = 0;
		if(wFocus){ ti.flags["focusWindow"] = true; }
		if(tFocus){ ti.flags["topTab"] = true; }
		if(wFocus && tFocus){ ti.flags["focusTab"] = true; }
	}

	function compileOutput(){
		var output = {};
		for(var i in TabInfo_output){
			var key = TabInfo_output[i];
			output[key] = ti[key];
		}
		return output;
	}

	this.getInfo = function(){
		calculateImportance();
		lowerFlags();
		ti.lastActive++;
		var output = compileOutput();
		return output;
	}
}

/*** end class tabinfo ***/
