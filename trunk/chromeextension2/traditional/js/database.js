/*
   current database version - 1
*/
var database = {};
database.db = {};

database.open = function(){
   var dbSize = 5 * 1024 * 1024; // 5MB
   database.db = openDatabase('timemarks', '', 'Time Marks',dbSize);
}

database.onError = function(tx, e) {
   alert('Something unexpected happened: ' + e.message );
}

database.createTable = function() {
   if(database.db.version == ''){
      database.db.changeVersion("","0.0.6",function(){
         database.db.transaction(function(tx) {
            tx.executeSql("create table timemark(id string, timestamp integer, description string, color string, latitude integer, longitude integer, computer string, synced boolean)",[]);
            tx.executeSql("create table page(id string, timemark_id integer, title string, url string, favicon string, window integer, tabPosition integer, timeOpen integer)",[]);
         });
      });
   }
   if(database.db.version == "0.0.3"){
      database.db.changeVersion("0.0.3","0.0.6",function(){
         database.db.transaction(
            function(tx) {
               tx.executeSql("alter table timemark add column latitude integer",[]);
               tx.executeSql("alter table timemark add column longitude integer",[]);
               tx.executeSql("alter table timemark add column computer string",[]);
            }
         );
      });
   }
   
   if(database.db.version == "0.0.4"){
      database.db.changeVersion("0.0.4","0.0.6",function(){
         database.db.transaction(
            function(tx) {
               tx.executeSql("DROP TABLE timemark",[]);
               tx.executeSql("DROP TABLE page",[]);
               tx.executeSql("create table timemark(id string, timestamp integer, description string, color string, latitude integer, longitude integer, computer string, synced boolean)",[]);
               tx.executeSql("create table page(id string, timemark_id integer, title string, url string, favicon string, window integer, tabPosition integer, timeOpen integer)",[]);
            }
         );
      });
   }
   
}

database.addTimeMark = function(timemark){
   database.db.transaction(function(tx){
      //insert timemark
      tx.executeSql("INSERT INTO timemark (id,timestamp,description,color,latitude,longitude, computer, synced) VALUES (?,?,?,?,?,?,?,?)", [timemark.id,timemark.timestamp,timemark.description,timemark.color,timemark.latitude,timemark.longitude,timemark.computer,false],function(tx,result){
         for(i=0;i<timemark.pageArray.length;i++){
            var page = timemark.pageArray[i];
            tx.executeSql("INSERT INTO page (id,timemark_id, title, url, favicon, window, tabPosition, timeOpen) VALUES (?,?,?,?,?,?,?,?)", [page.id,timemark.id,page.title,page.url,page.favicon,page.window,page.tabPosition,page.timeOpen]);
         }
      });
      sendTimeMark(timemark.id);
   });
}
