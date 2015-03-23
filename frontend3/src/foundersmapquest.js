Logger("foundersmapquest.js Init");

// GLOBALS //

var DEBUG = true; // If true debug messages goes to console
var tableHeaders = [];
var tableContents = [];
var Markers = [];
var infoWindows = [];
var table = null;
var map;

/* DEPRECATED, for testing purposes */

var dataSet = [
    ['', '1', 'Google', 'Larry Page & Sergey Brin', 'Mountain View', 'USA', 'CA 94043', '1600 Amphiteatre Pkwy', 'http://i.forbesimg.com/media/lists/companies/google_416x416.jpg', 'http://google.com', '37.1', '122.2'],
    ['', '2', 'Microsoft', 'Bill Gates', 'View', 'USA', 'CA 94043', '1660 Amphiteatre Pkwy', 'http://www.microsoft.com/About/CorporateCitizenship/en-us/DownloadHandler.ashx?Id=07-03-02', 'http://apple.com', '35.1', '121.2'],
    ['', '3', 'Apple', 'El Otro', 'Cupertino View', 'USA', 'CA 94023', '1620 Amphiteatre Pkwy', 'http://pantalla-portatil.net/images/portatil-apple-macbook-pro-13-3.jpg', 'http://google.com', '37.4', '124.2']

];




/////////////////// FUNCTIONS ////////////////////////

// if DEBUG then log to console (default true)

function Logger(logtext) {
    if (DEBUG === true) {
        console.log(logtext);
    }
}


///////////////////////// DATA TABLE FUNCTIONS /////////////////////////////////////

function toggleDataTableCheckbox(id) {
    Logger("Regenerating map");
    refreshMarkers();
    location.href = "#maptitle";
}

function clearDataTable() {
    table.fnClearTable();
    table.fnDestroy();
    $("#example").html('<table id="example" class="table table-striped table-bordered" cellspacing="0"></table>');
}

function createDataTable(tableHeaders, tableContents) {


    // Clear tableContents columns number (it can be some erroneus input, more data than columns and things like so ... )

    tableContentsFiltered = [];
    for (i = 0; i < tableContents.length; i++) {
        Logger("Checking tableContents ...");
        row = []
        if (tableContents[i].length == tableColums.length) {
            tableContentsFiltered.push(tableContents[i]);
        }
    }

    Logger("tableContentsFiltered: " + tableContentsFiltered);

    // Check if CSV HEADER complaints with requirements

    // Id, Company Name, Founder, City, Country, Postal Code, Street, Photo, Home Page, Garage Latitude, Garage Longitude

    headersOK = true;

    for (i = 0; i < 11; i++) {
        if (tableHeaders[i].title.trim() != tableColums[i].title.trim()) { // i+1 because get rid of left checkbox
            headersOK = false;
            break;
        }

        // Add Specials to headers, like color, see photos or link pages

        if (tableHeaders[i].title.trim() == "Photo") {
            Logger("Detected Photo Header");
            tableHeaders[i].class = "center";
            tableHeaders[i].mRender = function (data, type, full) {
                return '<a href="' + data + '"><img src="' + data + '"  width="42" ></a>';
            }
        }

        if (tableHeaders[i].title.trim() == "Home Page") {
            Logger("Detected Home Page Header");
            tableHeaders[i].mRender = function (data, type, full) {
                return '<a href="' + data + '">' + data + '</a>';
            }
        }


    }

    Logger("headersOK: " + headersOK);

    if (headersOK) {
        humane.log("Table Data is a correct CSV, showing it.")
        $("#viewtabledata").show();
        $("#map-canvas").show();
    } else {
        humane.log("Table Data is a CSV, but not valid, showing it already.")
        $("#viewtabledata").hide();
        $("#map-canvas").hide();
    }



    $('#example').dataTable({
        "data": tableContentsFiltered, //tableContentsFiltered, //dataSet,
        "dom": 'Rlfrtip',
        "bPaginate": false,
        "order": [[2,"asc"]],
        "columns": tableColums, // headerColumns,
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $('td:eq(0)', nRow).html('<form><input onclick="toggleDataTableCheckbox(' + iDataIndex + ')" id="ch' + iDataIndex + '"type="checkbox" checked="checked" name="checkbox" class="checkbox" value="' + iDataIndex + '"></form>');
            $('td:eq(5)', nRow).addClass('highlight');
            $('td:eq(10)', nRow).addClass('latitudecolumn');
            $('td:eq(11)', nRow).addClass('longitudecolumn');

        },
        "oColReorder": {
            "fnReorderCallback": function () {
                var colReorder = new $.fn.dataTable.ColReorder($('#example').dataTable());
                Logger(colReorder);
                Logger('Columns reordered');
            }
        }
    });


}



/////////////////////////// CSV FILE READ FUNCTIONS //////////////////////////////////



function abortRead() {
    Logger("abortRead");
    reader.abort();
}

function errorHandler(evt) {
    Logger("errorHandler");
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
        humane.log('File Not Found!');
        break;
    case evt.target.error.NOT_READABLE_ERR:
        humane.log('File is not readable');
        break;
    case evt.target.error.ABORT_ERR:
        break; // noop
    default:
        humane.log('An error occurred reading this file.');
    };
}

function updateProgress(evt) {
    Logger("updateProgress");
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}

function handleFileSelect(evt) {
        // Reset progress indicator on new file selection.
        Logger("handleFileSelect");
        progress.style.width = '0%';
        progress.textContent = '0%';
        csvOK = false;

        reader = new FileReader();
        if (FileReader != "undefined") {
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
            Logger("csv test");
            Logger(evt);
            fileName = evt.target.files[0].name.toLowerCase();
            fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension == "csv") {
                reader.onerror = errorHandler;
                reader.onprogress = updateProgress;
                reader.onabort = function (e) {
                    humane.log('File read cancelled');
                };
                reader.onloadstart = function (e) {
                    document.getElementById('progress_bar').className = 'loading';
                    csvOK = false;
                };
                reader.onload = function (e) {
                    // Ensure that the progress bar displays 100% at the end.
                    progress.style.width = '100%';
                    progress.textContent = '100%';
                    setTimeout("document.getElementById('progress_bar').className='';", 2000);
                    Logger("File loaded");

                        
                    // Parse CSV and    
                    // Render table

                    tableHeaders = [];
                    tableContents = [];
                    csvseparator = $("#selectcsv :selected").html()

                    // var table = $("<table />");
                    Logger("build table from: " + e.target.res);
                    var firstrow = true;
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var cells = rows[i].split(csvseparator);
                        for (var j = 0; j < cells.length; j++) {
                            cell = cells[j];
                         }
                        // If it is a HEADER row
                        if (firstrow == true) {
                            // Build Headers    
                            Logger("Building headers from:" + cells);
                            tableHeaders.push({
                                title: "Select"
                            });
                            for (k = 0; k < cells.length; k++) {
                                // Strip beginning and aend double quotes
                                clean = cells[k].trim();
                                clean = clean.replace(/^"|"$/g, '')
                                clean = clean.replace(/^'|'$/g, '')

                                //clean = cells[k];
                                //clean = clean.substr(1, clean.length-2);

                                element = {
                                    title: clean,
                                    "class": "center"
                                };
                                tableHeaders.push(element);                          
                            }
                            firstrow = false;
                            Logger("tableHeaders: " + tableHeaders);
                        } else { // If it is a DATA row
                            rowData = [];
                            rowData.push("");
                            for (k = 0; k < cells.length; k++) {
                                
                                // Strip beginning and aend double quotes

                                clean = cells[k].trim();
                                clean = clean.replace(/^"|"$/g, '')
                                clean = clean.replace(/^'|'$/g, '')
                                rowData.push(clean);
                            }
                            tableContents.push(rowData);
                        }
                    }
                    csvOK = true;
                    onCSVLoaded(reader);
                }
            } else {
                Logger("not a valid CSV file.");
                humane.log("Please upload a valid CSV file.");
            }
        } else {
            Logger("browser don't support HTML5.");
            humane.log("This browser does not support HTML5.");
        }

        // Read in the CSV file

        reader.readAsText(evt.target.files[0]);
     


        // try to parse it

    } // END handleFileSelect

function onCSVLoaded(reader) {
    Logger("onCSVLoaded")
    Logger("File readed reader:");
    Logger("csvOK: " + csvOK);
    Logger("File Loaded.");
    Logger("Header: " + tableHeaders);
    Logger("Regenerating " + table);
    clearDataTable();
    createDataTable(tableHeaders, tableContents);


    // Reload combos with marker, lat, lon

    combomarker = $("#csvmapmarkerfield");

    fieldCounter = 0;
    tableHeaders.forEach(function (entry) {
        Logger(entry);

        addOptionSelect(entry, $("#csvmapmarkerfield"), "Company Name", fieldCounter);
        addOptionSelect(entry, $("#csvlonfield"), "Garage Longitude", fieldCounter);
        addOptionSelect(entry, $("#csvlatfield"), "Garage Latitude", fieldCounter);
        fieldCounter++;
    });
    $("#csvselectors").show();
    refreshMarkers();
    location.href = "#datatabletitle";
}

function addOptionSelect(entry, element, selected) {
    if (entry.title != "Select") { // Slip first header

        optiontext = "<option>";
        if (entry.title == selected) {
            valueselected = true;
            Logger("selected: " + entry.title);
        } else {
            valueselected = false;
        }
        element.append($(optiontext, {
            value: fieldCounter,
            text: entry.title,
            selected: valueselected
        }));
    }
}

////////////////// GOOGLE MAPS API FUNCTIONS ///////////////////


function deleteMarkers() {
    for (i = 0; i < Markers.length; i++) {
        Markers[i].setMap(null);
    }
    // Markers.Clear();
    Markers = [];
    var bounds = new google.maps.LatLngBounds(null);
    map.fitBounds(bounds);
    
}



function drawMarkers() {


    Logger("view table data");
    Logger(map);
    var cells = [];
    var lats = [];
    var longs = [];
    var tooltiptexts = [];
    var rows = $("#example").dataTable().fnGetNodes();
    Logger("Getting CSV ID");
    fieldCounterMarker = parseFloat($("#csvmapmarkerfield").val());
    fieldCounterLat = parseFloat($("#csvlonfield").val());
    fieldCounterLon = parseFloat($("#csvlatfield").val());

    //fieldCounterMarker = 2;
    // fieldCounterLat = 10;
    // fieldCounterLon = 11;


    for (var i = 0; i < rows.length; i++) {
        //  Only if row selected
        //val = $(rows[i]).find("td:eq(0)").val();
        //Logger("Checking row selected " + i + " selected: " + val);
        checkid = "ch" + i;
        valcheck = $("#" + checkid)[0].checked
        Logger("Table valueid " + i + " checked: " + valcheck);




        if (valcheck == true) {

            // Get HTML of 3rd column (for example $("#example tr > .child ul li").eq(1).find(".dtr-data").html()
            //$("#example tr > .child ul li").eq(1).find(".dtr-data").html()
            // $("#example tr > .child ul li").eq(1).find(".dtr-data").html()
            //$("#example tr > .child").find("li")
            //  console.log("leido: " + $("#example tr > .child ul li").eq(1).find(".dtr-data").html();
            //$(rows[i]).find("td:eq(0)").find("#ch0")[0].checked


            //drawMarker = $(rows[i]).find("td:eq(2)").html();
            // cells.push($(rows[i]).find("td:eq(2)").html());
            //    lats.push($(rows[i]).find("td:eq(10)").html());
            //  longs.push($(rows[i]).find("td:eq(11)").html());

            lon = (tableContents[i][fieldCounterLat]);
            lat = (tableContents[i][fieldCounterLon]);
            markertext = (tableContents[i][fieldCounterMarker]);

            lats.push(lat);
            longs.push(lon);
            tooltiptexts.push(markertext);
            cells.push(marker);

        }
    }
    Logger(tooltiptexts);
    Logger(lats);
    Logger(longs);

    for (i = 0; i < cells.length; i++) {

        var myLatlng = new google.maps.LatLng(parseFloat(lats[i]), parseFloat(longs[i]));
     

        var marker = new google.maps.Marker({
            position: myLatlng,
            clickable: true,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10, //tamaño
                strokeColor: '#f00', //color del borde
                strokeWeight: 5, //grosor del borde
                fillColor: '#00f', //color de relleno
                fillOpacity: 1 // opacidad del relleno
            },
            map: map,
            labelContent: tooltiptexts[i],
            labelAnchor: new google.maps.Point(10, 10),
            labelClass: "label",
            title: tooltiptexts[i]
        });
        
  
        
        addInfoWindow(marker, '<div style="color: black!important"><b>' + tooltiptexts[i] + '</b></div>');        
        Markers.push(marker);
    }
}

function addInfoWindow(marker, message) {

      
    var infoWindow = new google.maps.InfoWindow({
        content: message,
      
        shadowStyle: 1,
        padding: 10,      
        backgroundColor: 'white',
        borderRadius: 5,
        arrowSize: 10,
        borderWidth: 1,
        maxWidth: 400,
        borderColor: '#A85E45',
        disableAutoPan: false,
        hideCloseButton: true,
        arrowPosition: 50,
        backgroundClassName: 'phoney',
        disableAutoPan: true,
        hideCloseButton: false,
        arrowStyle: 0
        
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
    
    infoWindow.open(map, marker);
    
}


function refreshMarkers() {

    try {
        deleteMarkers();
        drawMarkers();
        centerMarkersOnMap();
        humane.log("Map markers refreshed.");
    } catch (err) {
        deleteMarkers();
        humane.log("Didn't found valid info for map refreshing.");
        Logger("refreshMarkers Exception:" + err);
    }

}

function centerMarkersOnMap() {
    map.fitBounds(Markers.reduce(function (bounds, marker) {
        return bounds.extend(marker.getPosition());
    }, new google.maps.LatLngBounds()))
}

