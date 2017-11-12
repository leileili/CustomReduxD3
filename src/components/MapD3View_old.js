import React, { Component } from 'react';
import * as d3 from "d3";

export default class MapD3View extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		let self = this;

		this.initMap()
		this.setMap()

	}
	
	drawMap() {
		var self = this
		var projection = this.overlay.getProjection(),
				padding = 10;
		var polys = [];
		for (var i=0; i<this.props.data.length; i++) {
			var coordinates = this.props.data[i].geo;
			var points = []
			for (var j=0; j<coordinates.length; j++) {
				var geo_dot = coordinates[j];

				var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        points.push(dd.x+ ","+ dd.y)
			}
			polys.push(points.join(" "))
		}
		
		for (var i=0; i<polys.length; i++) {
			var marker = this.layer.selectAll("svg")
	          .data(d3.entries(self.data))
	          .each(transform) // update existing markers
	        .enter().append("svg")
	          .each(transform)
	          .attr("class", "marker");
	
			marker.append("polygon")
			   .attr("points", polys[i])
			   .style("fill", "red")
			   .style("stroke", "red")
			   .style("strokeWidth", "10px");
			/*
		      // Add a circle.
			marker.append("circle")
		          .attr("r", 40)
		          .attr("cx", 0)
		          .attr("cy", 0);
		
		      // Add a label.
			marker.append("text")
		          .attr("x", 80 + 7)
		          .attr("y", 80)
		          .attr("dy", ".31em")
		          .text(function(d) { 
		 
		        	  return d.value.properties.label_name; });
		*/
			function transform(d) {
				var geo = d.value.geometry.coordinates[0];
				var geo_dot = geo[0];
				
		        var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        debugger
		        return d3.select(this)
		            .style("left", (dd.x - padding) + "px")
		            .style("top", (dd.y - padding) + "px");
			}
		}
	
		
    }
	initMap() {
		
		var mapProp= {
				center:new google.maps.LatLng(38.851817,-76.962013),
				zoom:9,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map=new google.maps.Map(document.getElementById("map"),mapProp);
		/*this.map = new google.maps.Map(d3.select("#map"), {
			  zoom: 8,
			  center: new google.maps.LatLng(37.76487, -122.41948),
			  mapTypeId: google.maps.MapTypeId.TERRAIN
			});
	
			// Load the station data. When the data comes back, create an overlay.
			*/
	}
	setMap() {
		var self = this;
		//this.data = this.props.data.geo;//[{ "type": "Feature", "id": 0, "properties": { "name": "Naylor Gardens", "cartodb_id": 10, "objectid": 10, "web_url": "http:\/\/op.dc.gov", "label_name": "Naylor \r\nGardens", "datelastmo": "2003\/04\/10 00:00:00+00", "shape_leng": 2986.253185, "shape_area": 559270.429390, "2010": null, "2011": 2, "2012": 1, "2013": null, "2014": null, "total": 3.000000 }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -76.958104, 38.854865 ], [ -76.962013, 38.851817 ], [ -76.962884, 38.851922 ], [ -76.964408, 38.853257 ], [ -76.965626, 38.854592 ], [ -76.96737, 38.856846 ], [ -76.967644, 38.857513 ], [ -76.968181, 38.858851 ], [ -76.968198, 38.859638 ], [ -76.968208, 38.860248 ], [ -76.966929, 38.859914 ], [ -76.96475, 38.860735 ], [ -76.958924, 38.859288 ], [ -76.958927, 38.858786 ], [ -76.958964, 38.857259 ], [ -76.958974, 38.856515 ], [ -76.958612, 38.855313 ], [ -76.958104, 38.854865 ] ] ] } }]

			
		this.overlay = new google.maps.OverlayView();

		  // Add the container when the overlay is added to the map.
		this.overlay.onAdd = function() {
		    self.layer = d3.select(self.overlay.getPanes().overlayLayer).append("div")

		    // Draw each marker as a separate SVG element.
		    // We could use a single SVG, but what size would it have?
		    self.overlay.draw = function() {
		    	self.drawMap();
		    }
		};

		  // Bind our overlay to the map…
		this.overlay.setMap(this.map);
	}

	
	  
	render() {
		
		var self = this;
		//console.log("X="+self.state.detailX)
		
	    return (
    			<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    )
	}
}

