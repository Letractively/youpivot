	/*
	 * 
	 * General Functions
	 * 
	 */
	function validPageToLog(url){
		if(url.indexOf('chrome://')>=0)
			return false;
		if(url.indexOf('chrome-extension://')>=0)
			return false;
		if(localStorage["serverUrl"])
		  if(localStorage["serverUrl"] != "")
		    if(localStorage["serverUrl"].length > 0)
		      if(url.indexOf(localStorage["serverUrl"])>=0)
		        return false;
		
		return true;
	}
	
	/*
	 * GENERIC CALLBACK FUNCTION
	 */

	function genericCallBack(data){
		
	}
	
	/*
	 * 
	 * Data Logging
	 * 
	 * 
	 */
	
	var userBigTable = true;

	function messagePassingArray(){
		var mpa = new _Hash(false);
		
		var dateTime = new Date().getTime()/1000.0;
		
		mpa.setItem("tabID", -1);
		mpa.setItem("winID", -1);
		mpa.setItem("tabIndex", -1);
		//mpa.setItem("importance", Math.random());
		mpa.setItem("importance", -1);
		mpa.setItem("keywords","");
		mpa.setItem("url","");
		mpa.setItem("localDate",dateTime);
		mpa.setItem("eventType","");
		mpa.setItem("eventType_update","");
		mpa.setItem("title","");
		
		var value_pivotID = localStorage["pivotID"];  
	  if (!value_pivotID) {
	    value_pivotID = "none";
	  }
		
		mpa.setItem("pivotID",value_pivotID);
		
		return mpa;
	}
	/*
	 * WEB BASED HANDLER - SEND REQUEST TO WEB SERVICE
	 * 
	 */
	 function api_GenericEventHandler_webDB(mpa,command, callback, stateChangeFunction){
		 
			 var xhr = new XMLHttpRequest();
				
				xhr.onreadystatechange = function(data){	
					stateChangeFunction(data);
				}
				
			    var favorite = localStorage["serverUrl"];
				var host = 'https://tapestry02.appspot.com';
				if(favorite.length > 0)
					host = favorite;
				
				var url = host+'/'+command+'?blank=blank';
				
				var items = mpa.getArray();
				for (var key in items) {
					url = url +"&"+key+"="+(items[key]);
				}
				console.log(url);
			    xhr.open('GET', url, true);
			    xhr.send();
				return xhr;
	 }
	 
	 /*
	  * PAGE VISIT HANDLER THAT CONSTRUCTS ALL THE DATA TO BE STORED IN THE DATABASE
	  * 
	  */
	 	function api_GenericEventHandler(tab,eventType,callback,stateChangeFunction,mpa){

	 		
	 		if(tab!=null && tab != 'undefined'){			
	 			mpa.setItem("title",tab.title.replace(/&/g, '%26').replace(/#/g, '%23'));
	 		  //mpa.setItem("url",encode(tab.url.split("#")[0]).replace(/&/g, '%26'));
	 			mpa.setItem("url",encode(tab.url).replace(/&/g, '%26').replace(/#/g, '%23'));
	 		}
	 		mpa.setItem("eventType",eventType);
	 		
	 		if(userBigTable){
	 			return api_GenericEventHandler_webDB(mpa,"add",callback,stateChangeFunction);
	 		}else{
	 			//local db
	 		}
	 	}
