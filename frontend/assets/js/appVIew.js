define([
   
    'jquery'//,
   
   
    //'routers/main',
 //   'views/main'
], function ($) {
    // This is supposed to load, even if jQuery loads after the DOM ready event
   $(document).ready(function () {
    console.log("I don't want to play nice");
});

    return {
        initialize: function () {
            console.log("Init");
        }
    }
});