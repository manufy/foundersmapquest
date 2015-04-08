Frontend Assessment v0.3

Founders Map Quest
------------------

1 - CSV Import
2 - DataTable Render
3 - Map Render

a) HTML5 Frontend only at foundersmapquest_v0.3.html. Just download the zip and open this file in your favourite browser. Demo data is included as downloadable.

b) Future enhancements for backend, not used in this demo

-- 

You can import ANY csv file, but only files with defined format will be processed
You can select delimiter, google maps label, lat and long fields from csv
You can select rows with the left checkbox to visualize

BUGS:

Datatable  desktop size different from bootstrap theme size, so searchbox is not aligned and some columns overflow
Overflow between 1045 and 1192 pixels 

OPERATION:

Load a CSV
If you select / unselect rows, it gets reflected on map inmediatly
Same if you change the column data selectors (marker, long, lat)

Components used:

Bootstrap with an adapted theme
dataTables
humane.js for notifications
lightbox.js for image viewer

Javascript files at frontend3/src
Stylesheets at frontend3/css

Manuel Fernández Yáñez 2015