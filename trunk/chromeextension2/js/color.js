var Color = {};

(function(){
    var m = Color;
    
    m.toRGBArray = function(hexString){
        var r = parseInt(hexString.substr(1,2),16);
        var g = parseInt(hexString.substr(3,2),16);
        var b = parseInt(hexString.substr(5,2),16);
        return [r,g,b,255];
    }
})();
