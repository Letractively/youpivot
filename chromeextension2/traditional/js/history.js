
var endTimeStamps=new Array();
var endTimeStamps_index = -1;

var firstTimeStampInHistoryList_MS = -1;
var lastTimeStampInHistoryList_MS = -1;

var traditional_faviconDomainChecker = new Hash();
var traditional_filterList = new Array();


function getUsersHistory(){
	getUsersHistory_numWeeks('bodyCopy_history');
	
}

function resetUserHistory(){
	endTimeStamps_index = -1;
	firstTimeStampInHistoryList_MS = -1;
	lastTimeStampInHistoryList_MS = -1;
	endTimeStamps=new Array();
	getUsersHistory_numWeeks('bodyCopy_history');
	traditional_faviconDomainChecker.clear();
}

function older(){
	endTimeStamps_index++;
	endTimeStamps.push(lastTimeStampInHistoryList_MS);
	getUsersHistory_numWeeks('bodyCopy_history');
	
}
function newer(){
	endTimeStamps_index--;
	if(endTimeStamps_index >0){
		endTimeStamps.pop();
		getUsersHistory_numWeeks('bodyCopy_history');
	}else{
		endTimeStamps_index = 0;
		getUsersHistory_numWeeks('bodyCopy_history');
	}
	
}

function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}

function getUsersHistory_numWeeks(divName){
	//var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
	//var weeksOfDataToGet = 1;
	//var oneWeekAgo = (new Date).getTime() - (microsecondsPerWeek*weeksOfDataToGet);
	
	var endTime_MS = (new Date).getTime();
	
	if(endTimeStamps_index != -1){
		endTime_MS = endTimeStamps[endTimeStamps_index]+0.001;
	}else{
		endTimeStamps.push(endTime_MS);
		endTimeStamps_index=0;
	}
	
	
	chrome.history.search({
    	'text': '',              // Return every history item....
      	//'startTime': oneWeekAgo,  // that was accessed less than one week ago.
		'startTime': 0,
	  	'endTime': endTime_MS,
	  	'maxResults':100
    },
		function(historyItems) {
			
			//console.log(historyItems.length);
			
			var lastDateHeader = null;
			
			var lastDateHeaderID = "entry_null";
			
			var lastVisitTimeMS = endTimeStamps[endTimeStamps_index];
			var lastVisitTimeSt = new Date(lastVisitTimeMS).format("mmmm d, yyyy h:MM TT");
			
			$("#"+divName).empty(); //clear out old data
			//$("#navbar_filters_traditionalHistory").empty(); //clear out old data
			
			traditional_faviconDomainChecker.clear(); //clear out old favicon data too
			
			$("#"+divName).append("<div id='activeFilters_history' class='activeFilters'>" +"</div>"); //add active Filter DIV
			
			insertHistoryButtons(divName); //add buttons to top
			
			var traditionalHistoryListID = "traditionalHistoryList";
			$("#"+divName).append("<div id='"+traditionalHistoryListID+"'></div>");
			
			
			recurseOverHistoryList(historyItems,0,traditionalHistoryListID,lastDateHeader,"entry_null",lastVisitTimeMS,lastVisitTimeSt);
			
		
			insertHistoryButtons(divName); //add buttons to bottom
	
		}//end of function(historyItems)
	
	); // end of chrome.history.search(
	
	
}// end of function getUsersHistory_numWeeks

function recurseOverHistoryList(historyItems, historyItemIndex,traditionalHistoryListID,_lastDateHeader,_lastDateHeaderID,_lastVisitTimeMS,_lastVisitTimeSt){
	
	var lastDateHeader = _lastDateHeader;
	var lastDateHeaderID = _lastDateHeaderID;
	var lastVisitTimeMS = _lastVisitTimeMS;
	var lastVisitTimeSt = _lastVisitTimeSt;
	//console.log("recurse : "+historyItemIndex+" ? "+historyItems.length);	
	if(historyItemIndex < historyItems.length){
			var historyItem = historyItems[historyItemIndex];
			var url = historyItem.url;
			var itemTimestamp_MS = historyItem.lastVisitTime;
			var itemTimestamp_Obj = new Date(itemTimestamp_MS);
			
			var title = historyItem.title;
			
			//console.log(historyItemIndex+"\t"+title.substring(0, 10)+"\t"+(itemTimestamp_MS-1305840000000)+"\t"+(lastVisitTimeMS-1305840000000));
			
			if(itemTimestamp_MS<=lastVisitTimeMS){
				recurseOverHistoryList_helper(historyItems, historyItemIndex,traditionalHistoryListID,lastDateHeader,lastDateHeaderID,lastVisitTimeMS,lastVisitTimeSt,url,title,itemTimestamp_MS,itemTimestamp_Obj);
			}else{
				
				chrome.history.getVisits({
				  'url': url              // Return every history item....
				},function(visitItems) {
					
					if((url.indexOf("chrome-extension://", 0)<0) && (url.indexOf("file://", 0)<0) && (url.indexOf("chrome://", 0)<0) && (url.indexOf("//", 0)>=0) ){
						
						//console.log("*\tORIGINAL:\t"+(itemTimestamp_MS-1305840000000));
						//console.log("*\tTARGET  :\t"+(lastVisitTimeMS-1305840000000));
						//loop till statisifed
						var visitItemsIndex = visitItems.length-1;

                        while(itemTimestamp_MS>lastVisitTimeMS && visitItemsIndex >= 0){
                            
                            var visitItem = visitItems[visitItemsIndex];
                            
                            itemTimestamp_MS = visitItem.visitTime;
                            itemTimestamp_Obj = new Date(itemTimestamp_MS);
                            
                            //console.log("*\tTRIAL  :"+(itemTimestamp_MS-1305840000000));
                            
                            visitItemsIndex--;
                        }
					}			
					
					recurseOverHistoryList_helper(historyItems, historyItemIndex,traditionalHistoryListID,lastDateHeader,lastDateHeaderID,lastVisitTimeMS,lastVisitTimeSt,url,title,itemTimestamp_MS,itemTimestamp_Obj);
				}// end of function(visitItems) {
			);//end of chrome.history.getVisits(	
			}
	}else{
		createFilterList(traditional_faviconDomainChecker,"navbar_filters_traditionalHistory","traditionalHistoryList",traditional_filterList,"traditionalHistoryElement","activeFilters_history");
		//we have finished
		//console.log("finished : "+historyItemIndex+" < "+historyItems.length);	
	}	
}

function recurseOverHistoryList_helper(historyItems, historyItemIndex,traditionalHistoryListID,_lastDateHeader,_lastDateHeaderID,_lastVisitTimeMS,_lastVisitTimeSt,url,title,itemTimestamp_MS,itemTimestamp_Obj){
	var lastDateHeader = _lastDateHeader;
	var lastDateHeaderID = _lastDateHeaderID;
	var lastVisitTimeMS = _lastVisitTimeMS;
	var lastVisitTimeSt = _lastVisitTimeSt;
	
	//var title = historyItem.title;
	
	
	if(historyItemIndex==0)
		firstTimeStampInHistoryList_MS = itemTimestamp_MS; //at the top of the list
	lastTimeStampInHistoryList_MS = itemTimestamp_MS; //keep pushing the last timestamp back, ensuring the last one on the list 
	
	if((url.indexOf("chrome-extension://", 0)<0) && (url.indexOf("file://", 0)<0) && (url.indexOf("chrome://", 0)<0)&& (url.indexOf("//", 0)>=0)){
		
		if(lastDateHeader != itemTimestamp_Obj.format("dddd, mmmm d, yyyy")){
			
			lastDateHeaderID = generateHistoryDateHeader(traditionalHistoryListID,itemTimestamp_Obj);
			
			
			
			lastDateHeader = itemTimestamp_Obj.format("dddd, mmmm d, yyyy");
			lastVisitTimeSt = "";
			lastVisitTimeMS = 1.7976931348623157E+10308;
		}
		
		
		
		var itemTimestamp_St = itemTimestamp_Obj.format("mmmm d, yyyy h:MM TT");
		
		var printTitle = title;
		
		if((title.length == 0) || (title == " ") || (title == " ")){
			
			if((url.charAt(url.length-1) != "/") && ((url.indexOf("?", 0)<0))){
				var urlElements = url.split("/");
				
				printTitle = urlElements[urlElements.length-1]+" ("+url+")";
				
			}else{
				printTitle = url;
			}
		}
	
		generateOneHistoryEntry(url,printTitle,title,itemTimestamp_St,lastVisitTimeSt,lastDateHeaderID,itemTimestamp_Obj);
		
		lastVisitTimeSt = itemTimestamp_St;
		lastVisitTimeMS = itemTimestamp_MS;
		
		
	}//end of if statement checking to make sure this page should be shown	
	else{
		//console.log("REJECTED: "+url);
	}
	
	//console.log("\tPass timestamp:\t"+(lastVisitTimeMS-1305840000000));
	recurseOverHistoryList(historyItems, historyItemIndex+1,traditionalHistoryListID,lastDateHeader,lastDateHeaderID,itemTimestamp_MS,new Date(itemTimestamp_MS).format("mmmm d, yyyy h:MM TT"));
}

function generateHistoryDateHeader(traditionalHistoryListID,itemTimestamp_Obj){
	$("#"+traditionalHistoryListID).append("<div class='day'>" + itemTimestamp_Obj.format("dddd, mmmm d, yyyy") + "</div>");
	var lastDateHeaderID="entry_"+itemTimestamp_Obj.format("dddd_mmmm_d_yyyy")+"";
	$("#"+traditionalHistoryListID).append("<div id='"+lastDateHeaderID+"' class='entry'></div>");
	return lastDateHeaderID;
}

function generateOneHistoryEntry(url,title,rawTitle,itemTimestamp_St,lastVisitTimeSt,lastDateHeaderID,itemTimestamp_Obj){
	
		
	
		var div_title = document.createElement('div');
		div_title.setAttribute('class','title traditionalHistoryElement');
		document.getElementById(lastDateHeaderID).appendChild(div_title);
	
		//Do we show time of last visit, or do we show a vertical line
		var timeOfVisit = document.createElement('div');
		if(itemTimestamp_St == lastVisitTimeSt){ // the hours and minutes are the same, show vertical line
			timeOfVisit.setAttribute('class','timeOfVisit time gap');
		}else{ //the hours and minutes are not the same, show the time
			timeOfVisit.setAttribute('class','timeOfVisit time'); 
			timeOfVisit.appendChild(document.createTextNode(itemTimestamp_Obj.format("h:MM TT")));
		}
		div_title.appendChild(timeOfVisit);

		var favIconUrl = 'chrome://favicon/'+url;
		
		var doubleLineSplit = url.split("//");
		var extractedDomain = doubleLineSplit[1].split("/")[0];
				
		if((rawTitle.length == 0) || (rawTitle == " ")){

			favIconUrl = 'chrome://favicon/'+doubleLineSplit[0]+"//"+extractedDomain;
		}
		
		var idealFavicon = findIdealFavicon(url,title,favIconUrl);
		//console.log(idealFavicon);
		favIconUrl = idealFavicon[1];
		
		
		var uniqueHash = getUniqueString(url,favIconUrl,title);
		div_title.setAttribute(uniqeHashForFilterName, uniqueHash)
		
		//console.log(title.substring(0, 20)+": \t"+url.substring(0, 10)+"\t"+favIconUrl.substring(0, 40)+"\t"+extractedDomain+" \t"+uniqueHash);
		
		if(!traditional_faviconDomainChecker.hasItem(uniqueHash)){
			//console.log("NEW:\t"+url.substring(0, 10)+"\t"+favIconUrl.substring(0, 40)+"\t"+extractedDomain);
			traditional_faviconDomainChecker.setItem(uniqueHash,new Array(extractedDomain,favIconUrl,1));
		}else{
			var faviconDomainArray = traditional_faviconDomainChecker.getItem(uniqueHash);
			traditional_faviconDomainChecker.setItem(uniqueHash,new Array(extractedDomain,favIconUrl,faviconDomainArray[2]+1));
		}
				
		var a = document.createElement('a');
		a.href = url;
		a.setAttribute('style',"background-image:url('"+favIconUrl+"')");
		a.setAttribute('target',"_blank");	
		a.appendChild(document.createTextNode(title));
		a.setAttribute('class','title aFakeLink');
		a.setAttribute('title',title);
		
		div_title.appendChild(a);
}


function insertHistoryButtons(divName){
		var historyButtons = document.createElement('div');
		historyButtons.setAttribute('class','historyButtons');
		document.getElementById(divName).appendChild(historyButtons);
		
		var newest = document.createElement('div');
		newest.setAttribute('class','history_button history_button_newest');
		newest.appendChild(document.createTextNode("Newest History"));
		newest.addEventListener('click', resetUserHistory);
		historyButtons.appendChild(newest);
		
		var next = document.createElement('div');
		next.setAttribute('class','history_button history_button_next');
		next.appendChild(document.createTextNode("Older"));
		next.addEventListener('click', older);
		historyButtons.appendChild(next);
		
		var previous = document.createElement('div');
		previous.setAttribute('class','history_button history_button_previous');
		previous.appendChild(document.createTextNode("Newer"));
		previous.addEventListener('click', newer);
		historyButtons.appendChild(previous);	
	
}
