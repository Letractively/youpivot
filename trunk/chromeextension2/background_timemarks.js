//FIXME encapsulate this


if(window.localStorage['initialized']!="true"){
   window.localStorage['initialized'] = "true";
   window.localStorage['geolocation'] = "true";
   window.localStorage['timemarksync'] = "false";
   window.localStorage['computer_id'] = jQuery.uuid();
   chrome.tabs.create({"url":chrome.extension.getURL('optionsredirect.html')}); 
}

//correction for mistake reed made early on. Could be removed at somepoint
if(window.localStorage['geolocation'] == ""){
   window.localStorage['geolocation'] = "true";
}

if(window.localStorage['timemarksync'] == ""){
   window.localStorage['timemarksync'] = "false";
}

if(window.localStorage['computer_id'] == ""){
   window.localStorage['computer_id'] = jQuery.uuid();
}

//init
//connect and setup database
/* --------------------------------------------------- 
   Object Definitions
   --------------------------------------------------- */
//Page object 
function Page(title, url, favicon, windowNum, tabPosition, timeOpen) {
   this.title = title;
   this.url = url;
   this.favicon = favicon;
   this.window = windowNum;
   this.tabPosition = tabPosition;
   this.timeOpen = timeOpen;
   this.id = jQuery.uuid();
}

//timemark object
function TimeMark(description, pageArray,color,latitude,longitude){
   this.description = description;
   this.pageArray = pageArray;
   this.timestamp = new Date().getTime();
   this.id = jQuery.uuid();
   this.color = color;
   this.latitude = latitude;
   this.longitude = longitude;
   this.computer = window.localStorage['computer_id'];
}

function TabTrack(time){
   this.openTime = time;
}

/* --------------------------------------------------- 
   init
   --------------------------------------------------- */
database.open();
database.createTable();

_debug = false;
//change the icon if developer mode
if(chrome.extension.getURL("/") != "chrome-extension://bhojlafenkipmbhpfhoojcflnplpohoo/"){
   chrome.browserAction.setIcon({"path":"timemarks/images/timeMarkMarks/timemark_32_blue.png"});
   _debug = true;
}
 



//add a listener to listen for requests
//chrome.extension.onRequest.addListener(onRequest);
chrome.tabs.onCreated.addListener(newTab);
chrome.tabs.onUpdated.addListener(updateTab);
chrome.tabs.onRemoved.addListener(destroyTab);

//tab tracking
tabs = new Array();

/* --------------------------------------------------- 
   Functions
   --------------------------------------------------- */

function createNewTimeMark(description,color){
   //go through all the windows and all of their tabs and make new Page objects
   chrome.windows.getAll({populate: true},function(windows){
      //array to hold all the pages
      pageArray = new Array();
    
    
      for(i=0;i<windows.length;i++){
         var currentWindow = windows[i];
         for(j=0;j<currentWindow.tabs.length;j++){
            var currentTab = currentWindow.tabs[j];
            //check that it is a real tab
            if(currentTab.url.indexOf("chrome-devtools://") != 0 && currentTab.url.indexOf("chrome://") != 0 && currentTab.url.indexOf("chrome-extension://") != 0){
               var timenow = new Date();
               var timeOpen = null;
               if(tabs["_" + currentTab.id]){
                  timeOpen = timenow - tabs["_" + currentTab.id].openTime;
               }
               var page = new Page(currentTab.title, currentTab.url, currentTab.favIconUrl, currentTab.windowId, currentTab.index, timeOpen);
               pageArray.push(page);
            }
         }
      }
      var latitude = null;
      var longitude = null;
      if(window.localStorage['geolocation'] == "true"){
         console.log("getting geolocation.");
         navigator.geolocation.getCurrentPosition(function(position){
            console.log(position);
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            //create a new time mark object
            var timemark = new TimeMark(description,pageArray,color,latitude,longitude);
            database.addTimeMark(timemark);
         }, function(){
            console.log("position failed.");
            var timemark = new TimeMark(description,pageArray,color,latitude,longitude);
            database.addTimeMark(timemark);
         });
      }else{
         var timemark = new TimeMark(description,pageArray,color,latitude,longitude);
         database.addTimeMark(timemark);
      }
   });
}


//open timemark view
function viewTimeMarks(){
   chrome.tabs.create({"url":chrome.extension.getURL('history.html#tab=timemarks')});
}


//reopen timemark
function reopenTimemark(id){
   windows = [];
   database.db.transaction(function(tx){
      //insert timemark
      tx.executeSql("SELECT * FROM page WHERE timemark_id=?",[id],function(tx,result){
         for(i=0;i<result.rows.length;i++){
            var row = result.rows.item(i);
            if(typeof windows[row.window]  === 'undefined' || windows[row.window]  === null){
               windows[row.window] = [];
            }
            windows[row.window].push(row.url);
         }
         for(i in windows){
            var w = windows[i];
            chrome.windows.create({url:w});
         }
      });
   });
}

//request handler
function onRequest(request, sender, callback){
   switch(request.action){
      case "addTimeMark":
         createNewTimeMark(request.description,request.color);
         callback({});
         break;
      case "viewTimeMarks":
         viewTimeMarks();
         callback({});
         break;
      case "initSync":
         initSync();
         break;
      case "destroySync":
         destroySync();
         break;
      case "reopenTimemark":
         reopenTimemark(request.id);
         break;
   }
}

//new tab
function newTab(tab){
   tabs["_" + tab.id] = new TabTrack(new Date());
}

//
function destroyTab(tab){
   delete tabs["_" + tab];
}

//
function updateTab(tab){
   if(tabs["_" + tab]){
      tabs["_" + tab].openTime = new Date();
   }else{
      tabs["_" + tab] = new TabTrack(new Date());
   }
}
