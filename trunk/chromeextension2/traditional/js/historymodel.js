include("/js/dateutils.js");

var HistoryModel = new (function _HistoryModel(){
    var self = this;
    
    var validTransitions = ["link", "typed", "auto_bookmark", "manual_subframe", "generated", "start_page", "form_submit", "keyword", "keyword_generated"];

    self.getDayVisits = function(date, callback_quick, callback_full){
        var midnight = DateUtilities.getMidnightDay(date);
        var startTime = midnight.getTime();
        var endTime = midnight.getTime()+86399999;
        chrome.history.search({text: "", maxResults: 65535, startTime: startTime, endTime: endTime}, function(historyItems){
            var results = [];
            var resultCounter = 0;

            var history = [];

            for(var i = 0; i < historyItems.length; i++){
                history[historyItems[i].id] = {url: historyItems[i].url, title: historyItems[i].title};

                chrome.history.getVisits({url: historyItems[i].url}, function(visitItems){
                    console.log("hi");
                    for(var j in visitItems){
                        var hItem = history[visitItems[j].id];
                        if(visitItems[j].visitTime >= startTime && visitItems[j].visitTime <= endTime 
                            && isTransitionValid(visitItems[j].transition) && hItem.title != ""){
                            visitItems[j].url = hItem.url;
                            visitItems[j].title = hItem.title;
                            visitItems[j].domain = extractDomain(hItem.url);
                            visitItems[j].visitTime = Math.round(visitItems[j].visitTime);
                            results.push(visitItems[j]);
                        }
                    }
                    resultCounter++;
                    if(resultCounter == 30){
                        results.sort(sortByTime);
                        callback_quick(results);
                    }
                    if(resultCounter == historyItems.length){
                        results.sort(sortByTime);
                        callback_full(results);
                    }
                });
            }
        });
    }

    function extractDomain(url){
		var domain = url.split("://")[1];
		domain = domain.replace("www.", "");
		domain = domain.split("/")[0];
		return domain;
    }

    function isTransitionValid(transition){
        for(var i in validTransitions){
            if(validTransitions[i] == transition)
                return true;
        }
        return false;
    }

    function sortByTime(a, b){
        // sort in descending order
        return b.visitTime - a.visitTime;
    }

})();
