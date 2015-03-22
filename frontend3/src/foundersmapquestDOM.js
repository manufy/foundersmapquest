// Read CSV File

// This files initializes main logger dataTable, some jQuery listeners and google maps

var progress = document.querySelector('.percent');
var csvOK = false;



/* Table column definition with responsive tags */

var tableColums = [
    {
        "title": "Select",
        "class": "all"
                    },
    {
        "title": "Id",
        "class": "all"
                    },
    {
        "title": "Company Name",
        "class": "min-tablet",
                    },
    {
        "title": "Founder",
        "class": "min-desktop",
                    },
    {
        "title": "City",
        "class": "desktop"
                    },
    {
        "title": "Country",
        "class": "desktop",
                    },
    {
        "title": "Postal Code",
        "class": "desktop",
                    },
    {
        "title": "Street",
        "class": "min-desktop",
                    },
    {
        "title": "Photo",
        "class": "desktop",
        // Render column as Image with Hyperlink
        "mRender": function (data, type, full) {
            return '<a href="' + data + '"><img src="' + data + '"  width="42" ></a>';
        }
                    },
    {
        "title": "Home Page",
        class: "desktop",
        // Render column as Hyperlink
        "mRender": function (data, type, full) {
            return '<a href="' + data + '">' + data + '</a>';
        }
                    },
    {
        "title": "Garage Latitude",
        "class": "all"

                    },
    {
        "title": "Garage Longitude",
        "class": "all"
                    }
        ];


///////////// DEPRECATED ////////////////


$('#viewtabledata').click(function () {
    refreshMarkers();
});

/////////// CSV BUTTON LISTENER //////////////

Logger("DOM - Setting FileReader Listener");
document.getElementById('files').addEventListener('change', handleFileSelect, false);


///////////// DOCUMENT READY ////////////////

$(document).ready(function () {

    Logger("DOM Ready");
    
    // onChange Select for Marker, Lat & Lon

    $('#csvmapmarkerfield').on('change', function () {
        refreshMarkers();
    });

    $('#csvlonfield').on('change', function () {
        refreshMarkers();
    });

    $('#csvlatfield').on('change', function () {
        refreshMarkers();
    });

    // Hide CSV selectors until we have a CSV file loaded

  
    $("#csvselectors").hide();


    $('#example').dataTable({
        "data": null,
        "dom": 'Rlfrtip',
        "bPaginate": false,
        responsive: {
            details: {
                type: 'column'
            }
        },
        "columns": tableColums,
        
        // FOR FUTURE ENHANCEMENTS
        
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            Logger("fnCreatedRow");
            $('td:eq(0)', nRow).html('<form><input id="ch' + iDataIndex + '"type="checkbox" checked="checked" name="checkbox" class="checkbox" value="' + aData.Id + '"></form>');
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

    var lastIdx = null;
    table = $("#example").dataTable();
    initializeMapDOM();


}); // END DOM Ready

// Initialize Google Maps

function initializeMapDOM() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(37, 124.644)
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    Logger("DOM map initialized");
}