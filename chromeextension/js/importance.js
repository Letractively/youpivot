var ImportanceManager = {};

(function(){
	var m = ImportanceManager;
	m.sites = {};

	function addToSites(tabId, sitePoints){
		if(!sitePoints){
			throw "Site Points is not defined";
			return;
		}
		m.sites[tabId] = sitePoints;
	}

	function getSite(tabId){
		return m.sites[tabId];
	}

	m.getImportance = function(tabId){
		var site = getSite(tabId);
		console.log("site:", site);
		var value = site.getPoints();
		console.log(value);
		return value;
	}

	$(function(){
		startTimer();
	});

	/***********************************************************************************/

function windowFocusChanged(windowId) {
	distributePoints(false);
}

function tabNavigated(tabId, changeInfo, tab) {
	var site = new _SitePoints;
	site.addPoints_openedPage();
	addToSites(tabId, site);
}
function tabMoved(tabId, moveInfo) {
	distributePoints(false);
}
function tabRemoved(tabId) {
	distributePoints(false);
}
function tabSelectionChanged(tabId, selectInfo) {
	distributePoints(false);
}

/*
 * WIRE UP LISTENERS
 */
chrome.tabs.onUpdated.addListener(tabNavigated);
chrome.tabs.onMoved.addListener(tabMoved);
chrome.tabs.onRemoved.addListener(tabRemoved);
chrome.tabs.onSelectionChanged.addListener(tabSelectionChanged);

chrome.windows.onFocusChanged.addListener(windowFocusChanged);

	/***********************************************************************************/

	/*
	 * Constants
	 */
	var timerId = -1;
	var delay = 114*1000;
	var points_Max = 1.0;

	var points_topTab = 0.5; //4
	var points_inFocusTab = 0.2; //5
	var points_inFocusWindow = 0.1;
	var points_openedPage=0.3;

	//object
	function _SitePoints(){
		var myPoints = 0.001;
		var my_topTab = 0.0;
		var my_inFocusTab = 0.0;
		var my_inFocusWindow = 0.0;
		var my_openedPage = 0.0;
		var weightedPoints = 0.001;

		//add points according to value and weight
		function addPoints_(value,weight){
			myPoints= myPoints+(value*weight);
			if(myPoints > points_Max)
				myPoints = points_Max+0.0;		
		}

		// Top tab of the window, not necesarily in focus
		this.addPoints_topTab = function(){
			my_topTab = 1.0;
		}
		// The tab really in focus (top tab in the focused window)
		this.addPoints_inFocusTab = function(){
			my_inFocusTab=1.0;
		}
		// Inside the focus window, but not the top tab
		this.addPoints_inFocusWindow = function(){
			my_inFocusWindow = 1.0;
		}
		this.addPoints_openedPage = function(){
			console.log("openpage");
			my_openedPage = 1.0;
		}

		//add points only when I want to get it
		this.calculatePoints = function(weight){
			myPoints = 0.0;
			addPoints_(my_topTab,  points_topTab);
			addPoints_(my_inFocusTab,  points_inFocusTab);
			addPoints_(my_inFocusWindow,  points_inFocusWindow);
			addPoints_(my_openedPage,  points_openedPage);
			if(!weight){
				console.log("weight is false");
				weightedPoints = 0.01; 
				return; 
			}
			weightedPoints = myPoints/weight;
		}

		this.getPoints = function(){
			switch(lastActive){
				case 0: //active in the past 114s
					this.calculatePoints(1);
					break;
				case 1: //active in 114-228s ago
					this.calculatePoints(1);
					break;
				case 2: //active in 228-342s ago
					this.calculatePoints(1.2);
					break;
				case 3: //active in 342-456s ago
					this.calculatePoints(1.6);
					break;
				case 4: //active in 456-570s ago
					this.calculatePoints(2.0);
					break;
				default: //inactive for more than 570s
					this.calculatePoints(false);
					break;
			}
			return weightedPoints;
		}

		//reset the points
		this.clear = function(){
			myPoints = 0.001;
			my_topTab = 0.0;
			my_inFocusTab = 0.0;
			my_inFocusWindow = 0.0;
			my_openedPage = 0.0;
		}
	}

	/*
	 * TIMER RELATED FUNCTIONALITY
	 * 
	 */

	var lastActive = 0; // inactive for last n*114 seconds (n = lastActive)

	function distributePoints(byTimer){
		if(!byTimer){
			//if this function is not called by the timer but by user events
			lastActive = 0;
		}
		chrome.windows.getAll({"populate":true}, function (windows) {
			for (var i in windows) { 
				var win = windows[i]; 
				var w_focused = win.focused;
				for(var j in win.tabs) { 
					var tab = win.tabs[j]; 
					if(validPageToLog(tab.url) && getSite(tab.id)){
						var site = getSite(tab.id);
						var t_focused = tab.selected;
						if(w_focused) site.addPoints_inFocusWindow();
						if(t_focused) site.addPoints_topTab();
						if(w_focused && t_focused) site.addPoints_inFocusTab();
					}
				} //end tabs for loop
			} //end windows for loop
		});
	}
	function clearPoints(){
		chrome.windows.getAll({"populate":true}, function (windows) {
			for (var i in windows) { 
				var win = windows[i]; 
				for(var j in win.tabs) { 
					var tab = win.tabs[j]; 
					if(validPageToLog(tab.url) && getSite(tab.id)){
						var site = getSite(tab.id);
						site.clear();
					}
				}
			}
		});

		lastActive ++; //plus one for inactivity intervals
	}

	function timeIsUp(){
		distributePoints(true);
		clearPoints();
		startTimer();
	}

	function startTimer(){
		timerId = setTimeout(function(){ timeIsUp(); }, delay);
	}

})();
