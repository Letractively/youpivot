var Color = new (function _Color(){
    var self = this;
    
    self.toRGBArray = function(hexString){
        var r, g, b;
        if(hexString.indexOf("#") == 0){
            r = parseInt(hexString.substr(1,2),16);
            g = parseInt(hexString.substr(3,2),16);
            b = parseInt(hexString.substr(5,2),16);
        }else if(hexString.indexOf("rgb") == 0){
            var arr = hexString.split(",");
            r = parseInt(arr[0]);
            g = parseInt(arr[1]);
            b = parseInt(arr[2]);
        }
        return [r,g,b,255];
    }

    self.toRGBString = function(rgbArray){
        return "rgb(" + rgbArray.join(",") + ")";
    }
})();
