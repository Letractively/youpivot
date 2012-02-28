include("/js/dateutils.js");

var HistoryModel = new (function _HistoryModel(){
    var self = this;
    
    var validTransitions = ["link", "typed", "auto_bookmark", "manual_subframe", "generated", "start_page", "form_submit", "keyword", "keyword_generated"];

    self.searchVisits = function(needle, num, callback){
        getChromeVisits(needle, 0, new Date().getTime(), num, callback);
    }

    self.getNumVisits = function(oldestDate, newestDate, num, callback){
        getChromeVisits("", oldestDate, newestDate, num, callback);
    }

    function getChromeVisits(needle, oldestDate, newestDate, num, callback){
        chrome.history.search({text: needle, maxResults: num, startTime: oldestDate, endTime: newestDate}, function(historyItems){
            var results = [];
            var resultCounter = 0;

            var history = [];

            if(historyItems.length == 0){
                callback(results);
            }

            for(var i = 0; i < historyItems.length; i++){
                history[historyItems[i].id] = {url: historyItems[i].url, title: historyItems[i].title};

                chrome.history.getVisits({url: historyItems[i].url}, function(visitItems){
                    
                    for(var j in visitItems){
                        var hItem = history[visitItems[j].id];
                        if(visitItems[j].visitTime >= oldestDate && visitItems[j].visitTime <= newestDate 
                            && isTransitionValid(visitItems[j].transition) && hItem.title != ""){
                            visitItems[j].url = hItem.url;
                            visitItems[j].title = hItem.title;
                            visitItems[j].domain = extractDomain(hItem.url);
                            visitItems[j].visitTime = Math.round(visitItems[j].visitTime);
                            results.push(visitItems[j]);
                        }
                    }
                    resultCounter++;
                    if(resultCounter == historyItems.length){
                        results.sort(sortByTime);
                        results.splice(num, results.length - num);
                        callback(results);
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
