var Analytics = new (function _Analytics(){
    var self = this;

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    var fs = null;

    function errorHandler(e) {
        var msg = '';
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        };
        debug_warn("Error: " + msg);
    }

    function initFS() {
        window.requestFileSystem(window.TEMPORARY, 1024*1024, function(filesystem) {
            fs = filesystem;
        }, errorHandler);
    }
    if (window.requestFileSystem) {
        initFS();
    }

    function createLogFile(callback){
        fs.root.getFile('youpivot.tsv', {create: true}, callback, errorHandler);
    }

    function writeToFile(fileEntry, content){
        fileEntry.createWriter(function(fileWriter){
            fileWriter.onwriteend = function(e){
                console.log("Write completed.");
            }
            fileWriter.onerror = function(e){
                console.log("Write failed: ", e.toString());
            }

            var bb = new WebKitBlobBuilder();
            bb.append(content);
            fileWriter.write(bb.getBlob('text/plain'));
            location.href = fileEntry.toURL();
        });
    }

    self.writeLog = function(content){
        createLogFile(function(fileEntry){
            writeToFile(fileEntry, content);
        });
    }

    self.dumpLog = function(){
        var string = self.makeLog();
        self.writeLog(string);
    }

    self.makeLog = function(){
        var list = ItemManager.list;
        var output = [], a=0;
        console.log(list);
        for(var i in list){
            if(list[i].stream == "analytics"){
                var arr = [], b=0;

                arr[b++] = list[i].title;
                arr[b++] = list[i].domain.name;
                arr[b++] = list[i].startTime;
                arr[b++] = list[i].endTime;
                for(var j in list[i].keywords){
                    arr[b++] = list[i].keywords[j];
                }

                output[a++] = arr.join("\t");
            }
        }
        return output.join("\n");
    }

})();
