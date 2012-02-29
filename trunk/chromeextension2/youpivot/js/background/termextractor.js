var STOPWORDS = ["", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will","just","don", "should", "now"];
var numKeywords = 5; // number of keywords to save. Most frequent words appeared in the page will be the keywords

var text = document.body.innerText;
var arr = text.split(/[^a-zA-Z0-9]/g);
var set = {};
for(var i in arr){
    addWord(arr[i]);
}
// find the words with maximum number of occurrences 
var max = [];
for(var i in set){
    if(set[i] < set[max[numKeywords-1]])
        continue;
    max[numKeywords-1] = i;
    for(var j=numKeywords-2; j>=0; j--){
        if(set[i] < set[max[j]]){
            break;
        }else{
            max[j+1] = max[j];
            max[j] = i;
        }
    }
}
console.log("set", set, max);
chrome.extension.sendRequest({action: "saveTerms", terms: max});

function addWord(word){
    var key = word.toLowerCase(); // TODO: is this desired behavior?
    for(var s in STOPWORDS){
        if(key == STOPWORDS[s])
            return;
        if(key.match(/^[0-9]*$/))
            return;
    }

    if(!set[key]) set[key] = 0;
    set[key]++;
}
