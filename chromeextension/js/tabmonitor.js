var Monitor = {};

(function(){
	var m = Monitor;
	var arr = m.tabs = {};
	var timerId = -1;

	//constants
	var updateInterval = 114*1000;

	$(function(){
		registerOpenTabs();
		updateFocus();
		startTimer();

		chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
			tabRemoved(tabId);
		});
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
			if(tab.status=="complete"){
				tabUpdated(tab);
			}
		});
		chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
			updateFocus();
		});
		chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
			updateFocus();
		});
		chrome.tabs.onDetached.addListener(function(tabId, detachInfo){
			updateFocus();
		});
		chrome.windows.onFocusChanged.addListener(function(windowId){
			updateFocus();
		});
	});

	function startTimer(){
		timerId = setTimeout(function(){ uploadUpdateInfo(); }, updateInterval);
	}

	/*** Server calls ***/
	function tabRemoved(tabId){
		//console.log("tab removed");
		if(arr[tabId]){
			uploadRemoveInfo(tabId);
			removeFromTabs(tabId);
		}
	}

	//note: Site redirection using JavaScript will cause an update
	function tabUpdated(tab){
		//console.log("tab updated");
		if(arr[tab.id]){
			uploadRemoveInfo(tab.id);
			removeFromTabs(tab.id);
		}
		if(urlValid(tab.url)){
			addToTabs(tab.id, createItemFromTab(tab));
			uploadOpenInfo(tab.id);
		}
	}

	function uploadRemoveInfo(tabId){
		console.log("remove", tabId);
		var info = arr[tabId].getInfo();
		console.log(info);
	}

	function uploadOpenInfo(tabId){
		console.log("open", tabId);
		var info = arr[tabId].getInfo();
		console.log(info);
	}

	//send updated info about all tabs to server, every 114 seconds
	function uploadUpdateInfo(){
		console.log("update tab");
		var batch = [];
		for(var i in arr){
			var info = arr[i].getInfo();
			batch[batch.length] = info;
		}
		uploadBatch(batch);
		startTimer();
	}

	function uploadBatch(batch){
		console.log(batch);
	}
	/*** end server calls ***/

	//check if the URL is valid for logging
	function urlValid(url){
		if(url.indexOf("chrome")===0){
			return false;
		}
		if(url.indexOf("about")===0) return false;
		return true;
	}

	function registerOpenTabs(){
		chrome.windows.getAll({populate: true}, function(windows){
			for(var i in windows){
				for(var j in windows[i].tabs){
					var tab = windows[i].tabs[j];
					if(urlValid(tab.url)){
						addToTabs(tab.id, createItemFromTab(tab));
					}
				}
			}
		});
	}

	m.getSelectedId = function(){
		return selected;
	}

	//change name to getInfo?
	m.getTabById = function(id){
		var output = arr[id].getInfo();
		return output;
	}

	function addToTabs(id, createObj){
		arr[id] = createTabInfo(createObj);
	}

	function removeFromTabs(id){
		if(arr[id]) delete arr[id];
	}

	function updateFocus(){
		//console.log("updateFocus");
		chrome.windows.getAll({populate: true}, function(windows){
			for(var i in windows){
				var wFocus = windows[i].focused;
				for(var j in windows[i].tabs){
					var tab = windows[i].tabs[j];
					var tFocus = tab.selected;
					if(arr[tab.id]){
						arr[tab.id].setFocus(tFocus, wFocus);
					}
				}
			}
		});
	}

	function getFavUrl(tab){
		if(tab.favIconUrl){
			return tab.favIconUrl;
		}
		//use Google S2 if favicon URL is not defined
		var domain = tab.url.split("://")[1];
		domain = domain.replace("www.", "");
		domain = domain.split("/")[0];
		var favIconUrl = "http://www.google.com/s2/favicons?domain="+domain;
		return favIconUrl;
	}

	//poor man's keyword generator
	//FIXME doesn't work for non-english alphabets
	function getKeywords(title){
		title = title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, " ");
		var output = title.split(" ");
		for(var i in output){
			if(output[i].length==0)
				output.splice(i, 1);
		}
		return output;
	}

	function createItemFromTab(tab){
		var cObj = {
			title: tab.title, 
			url: tab.url, 
			favUrl: getFavUrl(tab), 
			index: tab.index, 
			win: tab.windowId,
			keywords: getKeywords(tab.title), 
			parentTab: -1,
			parentWindow: -1
		};
		return cObj;
	}
})();
