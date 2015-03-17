require(["order!vendor/jquery-2.1.3.min",
         //"order!vendor/jquery-ui-1.8.19.custom.min",
         "order!vendor/underscore-min",
         "order!vendor/underscore.string.min",
         "order!vendor/less.min",
         "order!vendor/haml",
         "order!vendor/angular.min",
         "order!vendor/jquery.dataTables.min",
         "order!vendor/dataTables.bootstrap",
         //"order!vendor/dataTables.responsive",
         "order!vendor/dataTables.colReorder",
        // ZEPTO ERROR EN IE9 "order!vendor/zepto.min",
         "order!coffeejs/angular-init",
         "order!coffeejs/angular-app",
        // "order!appView"
         ], function ($) {
	

	    //This function is called when scripts/helper/util.js is loaded.
	    //If util.js calls define(), then this function is not fired until
	    //util's dependencies have loaded, and the util argument will hold
	    //the module value for "helper/util".
	    
    app();
});

function app() {
	//appView();
    
        $('#example').dataTable().on('column-reorder', function (e, oSettings, reorderSettings) {
            console.log("column reorder");
            var i, iLen, iCols = oSettings.aoColumns.length;
            for (i = 0, iLen = iCols; i < iLen; i++) {
                $(oSettings.aoColumns[i].nTh).off('click');
                oSettings.oApi._fnSortAttachListener(oSettings, oSettings.aoColumns[i].nTh, oSettings.aoColumns[i]._ColReorder_iOrigCol);
            }
        });

}





