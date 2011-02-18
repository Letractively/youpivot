var Monitor = {};

(function(){
	var cur = Monitor.current = {};
	var arc = Monitor.archive = new Array();

	var selected = false;

	$(function(){
		registerOpenTabs();
		updatePositions();

		chrome.tabs.onCreated.addListener(function(tab){
			//console.log("tab created");
			addToCurrent(tab.id, createItemFromTab(tab), false);
		});
		chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
			//console.log("tab removed");
			tabRemoved(tabId);
			updatePositions();
		});
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
			//console.log("tab updated");
			moveToArchive(tabId);
			addToCurrent(tabId, createItemFromTab(tab), true);
		});
		chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
			//console.log("tab selection changed");
			changeSelection(tabId);
		});
		chrome.windows.onCreated.addListener(function(window){
			//console.log("window created");
		});
		chrome.windows.onFocusChanged.addListener(function(windowId){
			if(windowId == chrome.windows.WINDOW_ID_NONE){
				//console.log("no focused window");
			   return;
			}
			//console.log("window focus changed");
			chrome.tabs.getSelected(windowId, function(tab){
				if(tab!=null){
					changeSelection(tab.id);
				}
			});
		});
	});

	function tabRemoved(tabId){
		console.log("tab removed");
	}

	function registerOpenTabs(){
		chrome.windows.getAll({populate: true}, function(windows){
			for(var i in windows){
				for(var j in windows[i].tabs){
					var tab = windows[i].tabs[j];
					addToCurrent(tab.id, createItemFromTab(tab), false);
					if(tab.selected && windows[i].focused){
						changeSelection(tab.id);
					}
				}
			}
		});
	}

	Monitor.getSelectedId = function(){
		return selected;
	}

	Monitor.getTabById = function(id){
		var output = cur[id];
		output.importance = ImportanceManager.getImportance(id);
		return output;
	}

	function addToCurrent(id, createObj, update){
		cur[id] = createTabInfo(createObj);
		if(update) updatePositions();
	}

	function changeSelection(newId){
		//console.log("Selection", newId);
		if(selected==newId) return;
		if(selected && cur[selected]){ //make sure the selected is not being removed
			cur[selected].setFocus(false);
		}
		cur[newId].setFocus(true);
		selected = newId;
		updatePositions();
	}

	function updatePositions(){
		if(!cur[selected]){
			//console.log("no selected tab");
			return;
		}
		for(var i in cur){
			cur[i].setSelection({index: cur[selected].index, window: cur[selected].window});
		}
	}

	//deprecated
	function moveToArchive(id){
		cur[id].die();
		arc[arc.length] = cur[id];
		delete cur[id];
	}

	function createItemFromTab(tab){
		var cObj = {title: tab.title, url: tab.url, focus: tab.selected, index: tab.index, wind: tab.windowId};
		return cObj;
	}

	//get the tab distance from the selected tab
	Monitor.getTabDistance = function(id){
		return cur[selected].index - cur[id].index;
	}

	Monitor.debug = function(){
		return {current: cur, archive: arc};
	}
})();
