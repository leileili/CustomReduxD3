import React, { Component } from 'react';
import * as d3 from "d3";
import './map.css'

export default class MapD3View extends Component {
	constructor(props) {
		super(props);
		this.padding = 10
	}
	
	processData(projection) {
		var self = this;
		
		var items = [];
		var rects = []
		for (var i=0; i<self.props.data.length; i++) {
			var data = self.props.data[i];
			var coordinates = data.geo;
			var dots = []
			var minX = 99999;
			var minY = 99999
			var maxX = -99999;
			var maxY = -99999
			for (var j=0; j<coordinates.length; j++) {
				var geo_dot = coordinates[j];

				var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        minX = Math.min(minX, dd.x)
		        minY = Math.min(minY, dd.y)
		        maxX = Math.max(minX, dd.x)
		        maxY = Math.max(minY, dd.y)
			}
			rects.push([minX, minY, maxX-minX, maxY-minY])
		}
		for (var i=0; i<self.props.data.length; i++) {
			var data = self.props.data[i];
			var coordinates = data.geo;
			var polyPoints = []
			var dots = []
			var rect = rects[i]
			for (var j=0; j<coordinates.length; j++) {
				var geo_dot = coordinates[j];

				var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        var x = dd.x-rect[0];
		        var y = dd.y-rect[1];
		        
		        polyPoints.push(x+ ","+ y)
		        dots.push([x, y])
			}
			items.push({"name":data.name, "rect":rect, "dots":dots, "polyPoints":polyPoints.join(" ")})
		}
		return items;
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
		var projection = overlay.getProjection()

		  // Add the container when the overlay is added to the map.
		overlay.onAdd = function() {
		    var layer = d3.select(this.getPanes().overlayLayer).append("div")
		        .attr("class", "stations")
		    		    
		    
		    // Draw each marker as a separate SVG element.
		    // We could use a single SVG, but what size would it have?
		    overlay.draw = function() {
		    	d3.selectAll("svg").remove();
		    	var projection = this.getProjection()
			      var items = self.processData(projection)
			      for (var i=0; i<items.length; i++) {

			    	  var item = items[i]	
			    	  
			    	  var svg = layer.append("svg")
			          .attr("transform",
			  	    		"translate("+ item.rect[0] + "," + item.rect[1] +") ");
			    	  
			          for (var j=0;j<item.dots.length; j++) {
				    	  var dot = item.dots[j]
				    	  svg.append("circle")
				          .attr("r", 4.5)
				          .attr("cx", dot[0])
				          .attr("cy", dot[1])
				          .attr("fill", "#0F0")
				      }
			    	  
			          svg.append("polygon")
					   .attr("points", item.polyPoints)
					   .style("fill", "green")
					   .style("fill-opacity", 0.1)
					   .style("stroke", "red")
					   .style("strokeWidth", "10px");
				      
			      
			    }
		  }

		  
		}
		
		overlay.setMap(map);

	}
	  
	render() {
	    return (
	    		<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    		
	    )
	}
}

