// A data structure to isolate the sorting from the object key-value association. 
// Used like a normal javascript object (keyTable[0] / keyTable["abc"])
// Call sort like sort function for arrays, and use iterate to iterate through the table in the sorted order. 
var KeyTable = function(){
    var self = this;
    var keyTable = [];

    // sort the table. must be called before the other functions can be used. 
    function sort(sortFunction){
        var k=0;
        for(var i in self){
            keyTable[k++] = i;
        }

        keyTable.sort(function(a, b){
            return sortFunction(self[a], self[b]);
        });
    }
    Object.defineProperty(self, 'sort', {value: sort, writable: false, enumerable: false, configurable: false});

    // returns the item at index, in the order as it is sorted
    function itemAtIndex(index){
        return self[keyTable[index]];
    }
    Object.defineProperty(self, 'itemAtIndex', {value: itemAtIndex, writable: false, enumerable: false, configurable: false});

    // gets the length of the sorted elements
    function getLength(){
        return keyTable.length;
    }
    Object.defineProperty(self, 'length', {value: length, writable: false, enumerable: false, configurable: false});

    // iterate through the table by the order it is sorted
    function iterate(func){
        if(typeof func != "function") return;
        for(var i=0; i<keyTable.length; i++){
            func(self[keyTable[i]]);
        }
    }
    Object.defineProperty(self, 'iterate', {value: iterate, writable: false, enumerable: false, configurable: false});
};
