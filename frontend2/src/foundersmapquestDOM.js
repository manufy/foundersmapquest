// Read CSV File

                var reader;
                var progress = document.querySelector('.percent');
                var csvOK = false;


                


                $('#viewtabledata').click(function () {

                    deleteMarkers();


                    console.log("viewtabledta");
                    console.log(map);
                    var cells = [];
                    var lats = [];
                    var longs = [];
                    var rows = $("#example").dataTable().fnGetNodes();
                    for (var i = 0; i < rows.length; i++) {
                        //  Only if row selected
                        val = $(rows[i]).find("td:eq(0)").val();
                        console.log("Checking row selected " + i + " selected: " + val);
                        checkid="ch"+i;
                        valcheck = $("#"+checkid)[0].checked
                        console.log("valcheck: " + valcheck);

                        if (valcheck == true) {

                            // Get HTML of 3rd column (for example)
                            cells.push($(rows[i]).find("td:eq(2)").html());
                            lats.push($(rows[i]).find("td:eq(10)").html());
                            longs.push($(rows[i]).find("td:eq(11)").html());
                        }
                    }
                    console.log(cells);
                    console.log(lats);
                    console.log(longs);

                    for (i = 0; i < cells.length; i++) {

                        var myLatlng = new google.maps.LatLng(parseFloat(lats[i]), parseFloat(longs[i]));

                        var infowindow = new google.maps.InfoWindow({
                            content: "MIINFO"
                        });

                        var marker = new google.maps.Marker({
                            position: myLatlng,
                             icon: {
                              path: google.maps.SymbolPath.CIRCLE,
                              scale: 10, //tamaño
                              strokeColor: '#f00', //color del borde
                              strokeWeight: 5, //grosor del borde
                              fillColor: '#00f', //color de relleno
                              fillOpacity:1// opacidad del relleno
                            },
                            map: map,
                            labelContent: "c,dskcsd",
                             labelAnchor: new google.maps.Point(10, 10),
                             labelClass: "label",
                            title: "Hello World!"
                        });
                         google.maps.event.addListener(marker, 'click', function() {
                            infowindow.open(map,marker);
                        });
                        marker.setMap(map);
                        Markers.push(marker);
                    }



                });




                console.log("settingListener");
                document.getElementById('files').addEventListener('change', handleFileSelect, false);

   
        $(document).ready(function () {
            console.log("document ready");
            $('#demo').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>');

            $('#example').dataTable({
                "data": dataSet,
                "dom": 'Rlfrtip',

                "columns": [
                    {
                        "title": "Select",

                    },
                    {
                        "title": "Id"
                    },
                    {
                        "title": "Company Name"
                    },
                    {
                        "title": "Founder"
                    },
                    {
                        "title": "City",
                        "class": "center"
                    },
                    {
                        "title": "Country",
                        "class": "center"
                    },
                    {
                        "title": "Postal Code"
                    },
                    {
                        "title": "Street"
                    },
                    {
                        "title": "Photo",
                        "class": "center",
                        // Render column as Image with Hyperlink
                        "mRender": function ( data, type, full ) {
                            return '<a href="'+data+'"><img src="'+data+'"  width="42" ></a>';
                        }
                    },
                    {
                        "title": "Home Page",
                        "class": "center",
                        // Render column as Hyperlink
                        "mRender": function ( data, type, full ) {
                            return '<a href="'+data+'">' +data+'</a>';
                        }
                    },
                    {
                        "title": "Garage Latitude",
                        "class": "center"
                    },
                    {
                        "title": "Garage Longitude",
                        "class": "center"
                    }
        ],
                "fnCreatedRow": function (nRow, aData, iDataIndex) {
                    console.log("fnCreatedRow");
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
        initialize();
        //google.maps.event.addDomListener(window, 'load', initialize);

    }); // Ready