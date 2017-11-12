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
			var xys = []
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
			var points = []
			var xys = []
			var rect = rects[i]
			for (var j=0; j<coordinates.length; j++) {
				var geo_dot = coordinates[j];

				var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        points.push((dd.x-rect[0]+self.padding)+ ","+ (dd.y-rect[1]+self.padding))
		        xys.push([dd.x, dd.y])
			}
			items.push({"name":data.name, "rect":rect, "xys":xys, "points":points.join(" ")})
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
		var overlay2 = new google.maps.OverlayView();
		var projection = overlay.getProjection()
		var projection2 = overlay2.getProjection()
		  // Add the container when the overlay is added to the map.
		overlay.onAdd = function() {
		    var layer = d3.select(this.getPanes().overlayLayer).append("div")
		        .attr("class", "stations")
		    		    
		    
		    // Draw each marker as a separate SVG element.
		    // We could use a single SVG, but what size would it have?
		    overlay.draw = function() {
			      var projection = this.getProjection()
			      var items = self.processData(projection)
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
				          .attr("cx", self.padding)
				          .attr("cy", self.padding);	
				      function transform(d) {
				    		return d3.select(this)
				            	.style("left", (d.value[0]) + "px")
				            	.style("top", (d.value[1]) + "px")
				            	.style("width", (item.rect[2]) + "px")
				            	.style("height", (item.rect[3]) + "px")
				     }
			    }
		  }

		  
		}
		
		
		overlay2.onAdd = function() {
		    var layer = d3.select(this.getPanes().overlayLayer).append("div")
		        .attr("class", "stations2")
		    		    
		   
		    // Draw each marker as a separate SVG element.
		    // We could use a single SVG, but what size would it have?
		    overlay2.draw = function() {
		    	 var projection = this.getProjection()
			      var items = self.processData(projection)
			      for (var i=0; i<items.length; i++) {
			    	  if (i==1) {
			    		  break;
			    	  }
			    	  var item = items[i]	
			    	  
			    	  var poly = layer.selectAll("svg")
				          .data(d3.entries([item.rect]))
				        .enter().append("svg")
				          .each(transform)
			    	  poly.append("polygon")
					   .attr("points", item.points)
					   .style("fill", "red")
					   .style("fill-opacity", 0.5)
					   .style("stroke", "red")
					   .style("strokeWidth", "10px");
			    	  
				      function transform(d) {
				    		return d3.select(this)
				            	.style("left", (d.value[0]) + "px")
				            	.style("top", (d.value[1]) + "px")
				     }
			    }
		  }

		  
		}
		
		// Bind our overlay to the map…
		overlay.setMap(map);
		overlay2.setMap(map);
	}
	  
	render() {
	    return (
	    		<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    		
	    )
	}
}

