console.log("foundersmapquest.js init");


var tableHeaders = [];
var tableContents = [];
var Markers = [];
var infoWindows = [];

var table = null;
var dataSet = [
    ['', '1', 'Google', 'Larry Page & Sergey Brin', 'Mountain View', 'USA', 'CA 94043', '1600 Amphiteatre Pkwy', 'http://i.forbesimg.com/media/lists/companies/google_416x416.jpg', 'http://google.com', '37.1', '122.2'],
    ['', '2', 'Microsoft', 'Bill Gates', 'View', 'USA', 'CA 94043', '1660 Amphiteatre Pkwy', 'http://www.microsoft.com/About/CorporateCitizenship/en-us/DownloadHandler.ashx?Id=07-03-02', 'http://apple.com', '35.1', '121.2'],
    ['', '3', 'Apple', 'El Otro', 'Cupertino View', 'USA', 'CA 94023', '1620 Amphiteatre Pkwy', 'http://pantalla-portatil.net/images/portatil-apple-macbook-pro-13-3.jpg', 'http://google.com', '37.4', '124.2']

];

console.log("initialize map")
var map;


/////////////////// FUNCTIONS ////////////////////////



///////////////////////// DATA TABLE FUNCTIONS /////////////////////////////////////

function toggleDataTableCheckbox (id) {
    console.log("Regenerate map");
    refreshMarkers();
    location.href="#maptitle";
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
        console.log("Comprobando contents ...");
        row = []
        if (tableContents[i].length == tableColums.length) {
            tableContentsFiltered.push(tableContents[i]);
        }
    }

    console.log("tableContentsFiltered: " + tableContentsFiltered);

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
            console.log("Detected Photo Header");
            tableHeaders[i].class = "center";
            tableHeaders[i].mRender = function (data, type, full) {
                return '<a href="' + data + '"><img src="' + data + '"  width="42" ></a>';
            }
        }

        if (tableHeaders[i].title.trim() == "Home Page") {
            console.log("Detected Home Page Header");
            tableHeaders[i].mRender = function (data, type, full) {
                return '<a href="' + data + '">' + data + '</a>';
            }
        }


    }

    console.log("headersOK: " + headersOK);

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
        "columns": tableColums, // headerColumns,
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $('td:eq(0)', nRow).html('<form><input onclick="toggleDataTableCheckbox('+iDataIndex+')" id="ch' + iDataIndex + '"type="checkbox" checked="checked" name="checkbox" class="checkbox" value="' + iDataIndex + '"></form>');
            $('td:eq(5)', nRow).addClass('highlight');
            $('td:eq(10)', nRow).addClass('latitudecolumn');
            $('td:eq(11)', nRow).addClass('longitudecolumn');

        },
        "oColReorder": {
            "fnReorderCallback": function () {
                var colReorder = new $.fn.dataTable.ColReorder($('#example').dataTable());
                console.log(colReorder);
                //console.log($('#example').dataTable().oSettings);
                //console.log(aoColumns);
                console.log('Columns reordered');
            }
        }
    });


}



/////////////////////////// CSV FILE READ FUNCTIONS //////////////////////////////////



function abortRead() {
    console.log("abortRead");
    reader.abort();
}

function errorHandler(evt) {
    console.log("errorHandler");
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
    case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
    case evt.target.error.ABORT_ERR:
        break; // noop
    default:
        alert('An error occurred reading this file.');
    };
}

function updateProgress(evt) {
    console.log("updateProress");
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
        console.log("handleFileSelect");
        progress.style.width = '0%';
        progress.textContent = '0%';
        csvOK = false;

        reader = new FileReader();
        if (FileReader != "undefined") {
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
            console.log("csv test");
            console.log(evt);
            fileName = evt.target.files[0].name.toLowerCase();
            fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension == "csv") {
                reader.onerror = errorHandler;
                reader.onprogress = updateProgress;
                reader.onabort = function (e) {
                    alert('File read cancelled');
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
                    console.log("File loaded");



                    // Render table

                    tableHeaders = [];
                    tableContents = [];

                    // var table = $("<table />");
                    console.log("build table from: " + e.target.res);
                    var firstrow = true;
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        // console.log("row " + i + " start");
                        var cells = rows[i].split(",");
                        for (var j = 0; j < cells.length; j++) {
                            cell = cells[j];
                            //   console.log("row " + i + " append cell " + j + ": " + cell);
                        }
                        //  console.log("row end");
                        // If it is a HEADER row
                        if (firstrow == true) {
                            // Build Headers    
                            console.log("Building headers from:" + cells);
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
                                console.log("x");
                            }
                            firstrow = false;
                            console.log("tableHeaders: " + tableHeaders);
                        } else { // If it is a DATA row
                            rowData = [];
                            rowData.push("");
                            for (k = 0; k < cells.length; k++) {
                                // Strip beginning and aend double quotes

                                clean = cells[k].trim();


                                clean = clean.replace(/^"|"$/g, '')
                                clean = clean.replace(/^'|'$/g, '')


                                // clean = clean.substr(1, clean.length-2);


                                rowData.push(clean);
                            }
                            tableContents.push(rowData);
                        }

                    }

                    csvOK = true;
                    onCSVLoaded(reader);

                }
            } else {
                console.log("not a valid CSV file.");
                humane.log("Please upload a valid CSV file.");
            }
        } else {
            console.log("browser don't support HTML5.");
            humane.log("This browser does not support HTML5.");
        }

        // Read in the image file as text string.

        reader.readAsText(evt.target.files[0]);
        //console.log("File readed reader:");
        //console.log(reader);


        // try to parse it

} // END handleFileSelect

function onCSVLoaded(reader) {
    console.log("onCSVLoaded")
    console.log("File readed reader:");
    console.log("csvOK: " + csvOK);
    humane.log("File Loaded.");
    console.log("Header: " + tableHeaders);
    console.log("Destroying " + table);
    clearDataTable();
    createDataTable(tableHeaders, tableContents);
    
    
    // Reload combos with marker, lat, lon
    
    combomarker=$("#csvmapmarkerfield");
    
    fieldCounter = 0;
    tableHeaders.forEach(function(entry) {
        console.log(entry);
    
        addOptionSelect(entry, $("#csvmapmarkerfield"),"Company Name", fieldCounter);
        addOptionSelect(entry, $("#csvlonfield"),"Garage Longitude", fieldCounter);
        addOptionSelect(entry, $("#csvlatfield"),"Garage Latitude", fieldCounter);
        fieldCounter++;
    });
    
    refreshMarkers();
    location.href="#datatabletitle";
}

function addOptionSelect(entry, element,selected) {
     if (entry.title != "Select") { // Slip first header
    
          optiontext = "<option>";
          if (entry.title == selected) {
              valueselected = true;
              console.log("selected: " + entry.title );
          }
          else {
              valueselected = false;
          }
          element.append($(optiontext, { 
                value: fieldCounter,
                text : entry.title,
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
}



function drawMarkers() {


    console.log("viewtabledta");
    console.log(map);
    var cells = [];
    var lats = [];
    var longs = [];
    var rows = $("#example").dataTable().fnGetNodes();
    console.log("Getting CSV ID");
    fieldCounterMarker = parseFloat($("#csvmapmarkerfield").val());
    fieldCounterLat = parseFloat($("#csvlonfield").val());
    fieldCounterLon = parseFloat($("#csvlatfield").val());
    
     //fieldCounterMarker = 2;
   // fieldCounterLat = 10;
   // fieldCounterLon = 11;
    
    
    for (var i = 0; i < rows.length; i++) {
        //  Only if row selected
        val = $(rows[i]).find("td:eq(0)").val();
        console.log("Checking row selected " + i + " selected: " + val);
        checkid = "ch" + i;
        valcheck = $("#" + checkid)[0].checked
        console.log("Table valueid " + i + " checked: " + valcheck);

        
        
        
        if (valcheck == true) {

            // Get HTML of 3rd column (for example $("#example tr > .child ul li").eq(1).find(".dtr-data").html()
            //$("#example tr > .child ul li").eq(1).find(".dtr-data").html()
            // $("#example tr > .child ul li").eq(1).find(".dtr-data").html()
            //$("#example tr > .child").find("li")
            //  console.log("leido: " + $("#example tr > .child ul li").eq(1).find(".dtr-data").html();
            //$(rows[i]).find("td:eq(0)").find("#ch0")[0].checked
            
            
            drawMarker=$(rows[i]).find("td:eq(2)").html();
           // cells.push($(rows[i]).find("td:eq(2)").html());
        //    lats.push($(rows[i]).find("td:eq(10)").html());
          //  longs.push($(rows[i]).find("td:eq(11)").html());
            
            lon = (tableContents[i][fieldCounterLat]);
            lat = (tableContents[i][fieldCounterLon]);
            marker = (tableContents[i][fieldCounterMarker]);
            
            lats.push(lat);
            longs.push(lon);
            cells.push(marker);
            
        }
    }
    console.log(cells);
    console.log(lats);
    console.log(longs);

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
            labelContent: "c,dskcsd",
            labelAnchor: new google.maps.Point(10, 10),
            labelClass: "label",
            title: "Hello World!"
        });



        var infowindow = new google.maps.InfoWindow({
            content: "MIINFO"
        });
        //infoW
        //var marker = new google.maps.Marker({map: map, position: myLatlng, clickable: true});




        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
        marker.setMap(map);
        Markers.push(marker);
    }


}


function refreshMarkers() {
    humane.log("Map markers refreshed.");
    deleteMarkers();
    drawMarkers();
    centerMarkersOnMap();

}

function centerMarkersOnMap() {
    map.fitBounds(Markers.reduce(function (bounds, marker) {
        return bounds.extend(marker.getPosition());
    }, new google.maps.LatLngBounds()))
}