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
	
		doIt();
	
		function doIt(){
		  
		  var overlay = new google.maps.OverlayView();

		  // Add the container when the overlay is added to the map.
		  overlay.onAdd = function() {
		    var layer = d3.select(this.getPanes().overlayLayer).append("div")
		        .attr("class", "stations")
		    
		    var layer2 = d3.select(this.getPanes().overlayLayer).append("div")
	        	.attr("class", "stations");
		    
		    // Draw each marker as a separate SVG element.
		    // We could use a single SVG, but what size would it have?
		    overlay.draw = function() {
		      var projection = this.getProjection(),
		          padding = 10;
		      
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

			     
		         /* 	
			      marker2.append("line")
		          			.attr("x1", 5)
                            .attr("y1", 5)
                            .attr("x2", 50)
                            .attr("y2", 50)
			      			.attr("stroke-width", 2)
			      			.attr("stroke", "black");/*
				*/
			      
			      var polysvg = layer2.selectAll("svg")
		          .append("svg")
		          .attr("width", item.rect[2]).attr("height", item.rect[3])
					  .attr("transform", "translate(" + (item.rect[0]-5) + "," + (item.rect[1]-5) + ")")
     polysvg.append("polyline")
			      //.attr("points", "379.2753891556058,379.3128882672172 367.88960142224096,390.71307413332397 365.35263004433364,390.3203593197395 360.9136583111249,385.32722043269314 357.36597617785446,380.3339878261322 352.2862080000341,371.9032535405131 351.4881251556799,369.4083931808127 349.92399928881787,364.4036402289639 349.8744831997901,361.4598439488327 349.84535608883016,359.17809887893964 353.5707136001438,360.42745024338365 359.91751111112535,357.35642933729105 376.88696604431607,362.76903310243506 376.87822791095823,364.646773153916 376.77045760001056,370.35846270323964 376.74133048881777,373.1413239823887 377.79573191097006,377.63722921552835 379.2753891556058,379.3128882672172")
			      .attr("points","05,30 15,30 15,20 25,20 25,10 35,10")
			      .style("fill", "none")
			      .style("stroke", "black")
			      .style("stroke-width", "10");
			      
			      function transform(d) {
				    		return d3.select(this)
				            	.style("left", (d.value[0]) + "px")
				            	.style("top", (d.value[1]) + "px")
				            	.style("width", (item.rect[2]) + "px")
				            	.style("height", (item.rect[3]) + "px")
				      }
		    	  
		    	  /*
		    	  var marker = layer.append("g").attr("width", item.rect[2]).attr("height", item.rect[3])
				  .attr("transform", "translate(" + (item.rect[0]-5) + "," + (item.rect[1]-5) + ")")
	
				  marker.append("circle")
				  	.data([item.xys[0]])
					.attr("r", function(d){
						return 5})
					.attr("cx", function(d){return 5})
					.attr("cy", function(d){return 5})
					.style("stroke-width", 1)    // set the stroke width
					.style("stroke", "black")
					.style("cursor", "pointer")
					.style("fill", function(d) {return "#F00"})		*/				
			  }	
		      
		    };
		  };

		  // Bind our overlay to the map…
		  overlay.setMap(map);
		};
		
	}
	  
	render() {
	    return (
	    		<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    		
	    )
	}
}

