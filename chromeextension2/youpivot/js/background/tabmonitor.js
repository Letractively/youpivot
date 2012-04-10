include_("DomainExtractor");

var Monitor = {};

(function(){
	var self = Monitor;
	var arr = self.tabs = {};
	var timerId = -1;

	//constants
	var updateInterval = 114*1000;

    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
        tabRemoved(tabId);
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        if(tab.status=="complete"){
            tabUpdated(tab, changeInfo);
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

	$(function(){
		registerOpenTabs();
		updateFocus();
		startTimer();
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
	function tabUpdated(tab, changeInfo){
		//console.log("tab updated");
		if(arr[tab.id]){
			if(arr[tab.id].url==tab.url){
				console.log("URL did not change");
				return;
			}
			uploadRemoveInfo(tab.id);
			removeFromTabs(tab.id);
		}
		if(urlValid(tab.url)){
			addToTabs(tab.id, createItemFromTab(tab));
            console.log("add to tabs", arr);
            extractKeywords(tab.id, function(terms){
                if(terms.length > 0){
                    if(arr[tab.id])
                        arr[tab.id].keywords = terms;
                }
                uploadOpenInfo(tab.id);
            });
		}
	}

	function uploadRemoveInfo(tabId){
		console.log("remove", tabId);
		var info = arr[tabId].getInfo();
		var item = createRemoveItem(info);
		Connector.send("end", item, {
			onSuccess: function(data){
				if(data.length>0){
					console.log("remove successful, response: ", data);
				}else{
                    debug_warn("Error uploading remove tab info: "+data);
				}
			}, 
			onError: function(data){
				console.log("error uploading remove information. ", data);
			}
		});
	}

	function createRemoveItem(info){
		if(info.eid==-1){
			console.log("Event id is not defined in info. Cannot set end time for item", info);
			return false;
		}
		var obj = {};
		obj.endtime = Math.floor(new Date().getTime()/1000)+1;
		obj.eventid = info.eid;
		return obj;
	}

	function uploadOpenInfo(tabId){
		console.log("open", tabId);
        if(!arr[tabId]){
            debug_warn("arr[tabId] does not exist", tabId);
            return;
        }
		var info = arr[tabId].getInfo();
		var item = createOpenItem(info);
		Connector.send("add", item, {
			onSuccess: function(data){
				if(data.length>0 && data != "Missing Fields"){
					arr[tabId].eid = data;
					console.log("upload successful, event id: ", data);
				}else{
                    removeFromTabs(tabId);
					debug_warn("Error uploading open tab info: "+data);
				}
			}, 
			onError: function(data){
				debug_warn("error uploading open information. ", data);
			}
		});
	}
	
	function createOpenItem(info){
		var obj = {};
		obj.title = info.title;
		obj.url = info.url;
		obj.eventtypename = info.domain;
		obj.favicon = info.favUrl;
		obj.keyword = info.keywords;
		obj.starttime = Math.floor(new Date().getTime()/1000);
		obj.endtime = Math.floor((new Date().getTime())/1000 + 1);
		obj.time0 = Math.floor(new Date().getTime()/1000);
		obj.val0 = info.importance;
		obj.tabindex = info.index;
		obj.parenttab = info.parentTab;
		obj.parentwindow = info.parentWindow;
		obj.windowid = info.win;
		obj.stream = "chrometab";
		//obj = addKeywordsToItem(obj, info.keywords);
		console.log("domain", info.domain);
		return obj;
	}

	//add keywords to the item in keys "keyword0", "keyword1" etc
	function addKeywordsToItem(obj, keywords){
		for(var i in keywords){
			obj["keyword"+i] = keywords[i];
		}
		console.log(obj);
		return obj;
	}

	//send updated info about all tabs to server, every 114 seconds
	function uploadUpdateInfo(){
		console.log("update tab", arr);
		//var batch = [];
		for(var i in arr){
			var info = arr[i].getInfo();
            console.log("arr: ", arr);
            console.log("info:", info);
			if(!uploadUpdate(info)){
                removeFromTabs(i);
            }
			//batch[batch.length] = info;
		}
		//uploadBatch(batch);
		startTimer();
	}

	function uploadUpdate(info){
		var item = createUpdateItem(info);
		if(item === false){
			debug_warn("Update unsuccessful. Item is not created. ");
			return false;
		}
		Connector.send("update", item, {
			onSuccess: function(data){
				if(data.length>0){
					console.log("update successful");
				}else{
					debug_warn("Error uploading open tab info: "+data);
				}
			}
		});
        return true;
	}

	function createUpdateItem(info){
		if(info.eid==-1){
			console.log("ERROR updating item: event id is not defined", info);
			return false;
		}
		var obj = {};
        if(!info.importance)
            info.importance = 0;
		obj.val0 = info.importance;
		obj.time0 = Math.floor(new Date().getTime()/1000);
		obj.eventid = info.eid;
		obj.endtime = Math.floor(new Date().getTime()/1000)+1;
		return obj;
	}

	/*** end server calls ***/

    function extractKeywords(tabId, callback){
        var handler = function(request){
            if(request.action == "saveTerms"){
                callback(request.terms);
            }
            chrome.extension.onRequest.removeListener(handler);
        }
        chrome.extension.onRequest.addListener(handler);
        chrome.tabs.executeScript(tabId, {file: "youpivot/js/background/termextractor.js"}, function(){
            console.log("keywords extracted");
        });
    }

    self.saveKeywords = function(keywords){
        item.keywords = keywords;
        return item;
    }

    var unsupported = [".gif", ".jpg", ".jpeg", ".pdf", ".bmp", ".svg"];
	//check if the URL is valid for logging
	function urlValid(url){
		if(url.indexOf("chrome")===0)
			return false;
		if(url.indexOf("about")===0)
            return false;
        for(var i in unsupported){
            if(url.lastIndexOf(unsupported[i])===url.length - unsupported[i].length){
                return false;
            }
        }
		return true;
	}

	function registerOpenTabs(){
		/*
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
        */
	}

	self.getSelectedId = function(){
		return selected;
	}

	//change name to getInfo?
	self.getTabById = function(id){
		var output = arr[id].getInfo();
		return output;
	}

	function addToTabs(id, createObj){
		arr[id] = createTabInfo(createObj);
        console.log("Tab created, arr:", arr);
	}

	function removeFromTabs(id){
        console.log("remove from tabs: ", id, arr);
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
		var domain = DomainExtractor.getName(tab.url);
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

	function createItemFromTab(tab){
		var cObj = {
			title: tab.title, 
			url: tab.url, 
			domain: DomainExtractor.getName(tab.url),
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
