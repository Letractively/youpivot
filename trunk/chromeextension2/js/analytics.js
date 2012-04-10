var aid = pref("analyticsid");
var analyticsReady = false;

if(aid && aid != ""){
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', aid]);
    _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        analyticsReady = true;
    })();
}
