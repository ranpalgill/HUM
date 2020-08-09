
<!-- Java script to query google sheet and make tabel using DataTable  and JQuery -->

	google.charts.load('current', {'packages':['corechart']});

        var dtab;
        var data;
        var count = 0;
<!-- /gviz/tq on end of url gets the json back , gid is the tab (but not)  ?tqx=responseHandler:handleQueryResponse-->
        var URL='https://docs.google.com/spreadsheets/d/19tutZXzsOsUod5eqLQgnuUjYqi1h8IHIgAv_5v5idEU/gviz/tq#gid=1270181244'

        function getData() {
		if (google.visualization != undefined && google.visualization.Query != undefined ) {
			var query = new google.visualization.Query(URL);
			query.setQuery('select B,C,D,E,F,G');
			query.send(handleQueryResponse);
		} else {
		    console.log("Wait google.viz..")
		    setTimeout(getData, 300); // try again in 300 milliseconds
	      }
	}
 
        function handleQueryResponse(resp) {
	      if (resp.isError()) {
		  alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		  return;
	      } 
	     data= resp.getDataTable()
	     dtab = []
	     for (i=0; i<data.getNumberOfRows(); i++){
		var row = []
	     	for (rc=0; rc<6; rc++){
		   row.push(data.getValue(i, rc));
		}
		dtab.push(row);
	     }  
	}

        function setupTable() {
	     if (count >= 10) {
		alert("Failed to get data from "+URL);
		return
	     }

			<!-- paging: false,-->
	     if (dtab) {
		  var dt = $('#dtab').DataTable( {
			data: dtab,
			autoWidth: false,
			columns: [
				 { title: "Minority group", width: "50px" },
				 { title: "Field/Discipline" },
				 { title: "Name" },
				 { title: "URL"},
				 { title: "Cost" },
				 { title: "Notes" },
		                 ]	
		  });
		     
	      setupCol()
              } else {
		    count = count + 1;
		    console.log("Wait ..")
		    setTimeout(setupTable, 300); // try again in 300 milliseconds
	      }
	};



        function setupCol() {
		var table = $('#dtab').DataTable();
		 
		table.columns().flatten().each( function ( colIdx ) {
			// Create the select list and/or search box add  operation
			var search = $('<input type="text" placeholder="Search" />')
			if ([1,4].includes(colIdx)) {
			    search  = $('<select><option value=""></option></select>')
			    // Get the search data for the first column and add to the select list
			    table
			        .column( colIdx )
			        .cache( 'search' )
			        .sort()
			        .unique()
			        .each( function ( d ) {
					if (d !==  data.getValue(0,colIdx)) {// skip heading
					    search.append( $('<option value="'+d+'">'+d+'</option>') );
				        }
				      } );
		       }
			search.appendTo(
			     table.column(colIdx).footer()
			)
			.on( 'keyup change clear', function () {
				table.column( colIdx )
					 .search( $(this).val()).draw();
			    });
		} );
	}




        $(document).ready(function() {
	    getData()
            setupTable()	
	});


