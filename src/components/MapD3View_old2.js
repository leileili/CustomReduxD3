import React, { Component } from 'react';
import * as d3 from "d3";
import './map.css'

export default class MapD3View extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		var self = this;
		
		// Create the Google Map…
		var map = new google.maps.Map(d3.select("#map").node(), {
		  zoom: 14,
		  center: new google.maps.LatLng(38.854865, -76.958104),
		  mapTypeId: google.maps.MapTypeId.TERRAIN
		});
	
	    var overlay = new google.maps.OverlayView();

		  // Add the container when the overlay is added to the map.
		  overlay.onAdd = function() {

		      var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "SvgOverlay");
		      var svg = layer.append("svg");
		      var gunmalayer = svg.append("g").attr("class", "AdminDivisions");
		      var markerOverlay = this;
		      var overlayProjection = markerOverlay.getProjection();

		      var googleMapProjection = d3.geoTransform({point: function(x, y) {
		        d = new google.maps.LatLng(y, x);
		        d = overlayProjection.fromLatLngToDivPixel(d);
		        this.stream.point(d.x + 4000, d.y + 4000);
		      }});
		      
		      var path = d3.geoPath().projection(googleMapProjection);　


			  
			    // Draw each marker as a separate SVG element.
			    overlay.draw = function() {
			      var projection = this.getProjection(),
			          padding = 10;
			      
			     
					
			      var items = processData()
			      
			      for (var i=0; i<items.length; i++) {
			    	  if (i==1) {
			    		  break;
			    	  }
			    	  var item = items[i]	
			    	  
			    	  var marker = layer.selectAll("svg")
				          .data(d3.entries(item.xys))
				          .each(transform) // update existing markers
				        .enter().append("svg")
				          .each(transform)
				          .attr("class", "marker");
		
				      // Add a circle.
				      marker.append("circle")
				          .attr("r", 4.5)
				          .attr("cx", padding)
				          .attr("cy", padding);
		      
				      function transform(d) {
					    		return d3.select(this)
					            	.style("left", (d.value[0]) + "px")
					            	.style("top", (d.value[1]) + "px")
					            	.style("width", (item.rect[2]) + "px")
					            	.style("height", (item.rect[3]) + "px")
					      }
      
			      };
		  };

		  // Bind our overlay to the map…
		  overlay.setMap(map);
		};
		
	}
	  
	processData() {
		 var items = [];
			for (var i=0; i<self.props.data.length; i++) {
				var data = self.props.data[i];
				var coordinates = data.geo;
				var points = []
				var xys = []
				var minX = 99999;
				var minY = 99999
				var maxX = -99999;
				var maxY = -99999
				for (var j=0; j<coordinates.length; j++) {
					var geo_dot = coordinates[j];

					var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
			        dd = projection.fromLatLngToDivPixel(dd);
			        points.push(dd.x+ ","+ dd.y)
			        minX = Math.min(minX, dd.x)
			        minY = Math.min(minY, dd.y)
			        maxX = Math.max(minX, dd.x)
			        maxY = Math.max(minY, dd.y)
			        xys.push([dd.x, dd.y])
				}
				items.push({"name":data.name, "rect":[minX, minY, maxX-minX, maxY-minY], "xys":xys, "points":points.join(" ")})
			}
		return items
	}
	render() {
	    return (
	    		<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    		
	    )
	}
}

