import React, { Component } from 'react';
import * as d3 from "d3";
import './map.css'
import $ from 'jquery';

export default class MapD3View extends Component {
	constructor(props) {
		super(props);
		this.padding = 10
		this.infowindow = new google.maps.InfoWindow({
			  size: new google.maps.Size(150, 50)
			});
		this.state = {"dirty":false};
		this.id = "MapD3View"
		cm.subscribe("/MapD3View/refresh", function() {
			this.setState(Object.assign({}, this.state, {"dirty":!this.dirty}))
		}, this)
	}
	
	processData(projection) {
		var self = this;
		
		var items = [];
		var rects = []
		var rects2 = [];
		for (var i=0; i<self.props.data.length; i++) {
			var data = self.props.data[i];
			var coordinates = data.geo;
			var dots = []
			var minX = 99999;
			var minY = 99999
			var maxX = -99999;
			var maxY = -99999
			var minLat2 = 99999;
			var minLng2 = 99999
			var maxLat2 = -99999;
			var maxLng2 = -99999
			for (var j=0; j<coordinates.length; j++) {
				var geo_dot = coordinates[j];

				var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        minX = Math.min(minX, dd.x)
		        minY = Math.min(minY, dd.y)
		        maxX = Math.max(minX, dd.x)
		        maxY = Math.max(minY, dd.y)
		        
		        minLat2 = Math.min(minLat2, geo_dot[1])
		        minLng2 = Math.min(minLng2, geo_dot[0])
		        maxLat2 = Math.max(maxLat2, geo_dot[1])
		        maxLng2 = Math.max(maxLng2, geo_dot[0])
			}
			rects.push([minX, minY, maxX-minX, maxY-minY])
			rects2.push([minLat2, minLng2, maxLat2-minLat2, maxLng2-minLng2])
		}
		for (var i=0; i<self.props.data.length; i++) {
			var data = self.props.data[i];
			var coordinates = data.geo;
			var polyPoints = []
			var dots = []
			var rect = rects[i]
			var rect2 = rects2[i]
			for (var j=0; j<coordinates.length; j++) {
				var geo_dot = coordinates[j];

				var dd = new google.maps.LatLng(geo_dot[1], geo_dot[0]);
		        dd = projection.fromLatLngToDivPixel(dd);
		        var x = dd.x-rect[0];
		        var y = dd.y-rect[1];
		        
		        polyPoints.push(x+ ","+ y)
		        dots.push([x, y])
			}
			items.push({"name":data.name, "data":data, "featureData": self.props.featureData[i], "rect":rect, "rect2":rect2, "dots":dots, "polyPoints":polyPoints.join(" ")})
		}
		return items;
	}
	
	rectContains (x, y, rect) {
		//console.log("x="+x+" y="+y+" rect="+JSON.stringify(rect))
        return rect[0] <= x && x <= rect[0] + rect[2] && rect[1]<= y && y <= rect[1] + rect[3];
    }
	setStyle = (c, key, value) => {
		c._groups[0][0].setAttribute(key,  value);
		c._groups[0][0].style[key] =  value;
	}

	componentDidUpdate() {
		this.updateMap()
	}
	
	updateMap() {
		var self = this;
		
		// Create the Google Map…
		var map = new google.maps.Map(d3.select("#map").node(), {
		  zoom: 13,
		  center: new google.maps.LatLng(38.854865, -76.958104),
		  mapTypeId: google.maps.MapTypeId.TERRAIN
		});
	
		map.addListener('click', function(e) {
			 
			 for (var i=0; i<self.items.length; i++) {
				 var item = self.items[i]
				 if (self.rectContains(e.latLng.lat(), e.latLng.lng(), self.items[i].rect2)) {
					 var featureData = item.featureData;
					 self.infowindow.setContent("<h4>"+item.name+"</h4>"+JSON.stringify(featureData));
					 self.infowindow.setPosition(e.latLng);
					 self.infowindow.open(map);
					    
					 //alert(JSON.stringify(self.props.data[i]));
					 return;
				 }
			 }
		    //placeMarkerAndPanTo(e.latLng, map);
		  });
		map.addListener('mousemove', function(e) {
			 
			for (var i=0; i<self.items.length; i++) {
				 var item = self.items[i]
				 if (self.rectContains(e.latLng.lat(), e.latLng.lng(), item.rect2)) {
					 //self.polys[i].attr("fill", function(d){return "#F00"})
					 if (self.sel!==undefined) {
						 self.setStyle(self.sel, "fill", "#0F0")
					 }
					 self.sel = self.polys[i]
					 self.setStyle(self.sel, "fill", "#F00")
					 
					 
				        $('#marker-tooltip').html(item.name).css({
				            'left': item.rect[0],
				                'top': item.rect[1]
				        }).show();
					 //alert(JSON.stringify(self.props.data[i]));
					 return;
				 }
			 }
		    //placeMarkerAndPanTo(e.latLng, map);
		  });
		var overlay = new google.maps.OverlayView();
		var projection = overlay.getProjection()

		  // Add the container when the overlay is added to the map.
		overlay.onAdd = function() {
		    var layer = d3.select(this.getPanes().overlayLayer).append("div")
		        .attr("class", "stations")
		    		    
		    
		    // Draw each marker as a separate SVG element.
		    overlay.draw = function() {
		    	d3.selectAll("svg").remove();
		    	var projection = this.getProjection()
			      var items = self.items = self.processData(projection)
			      self.polys = [];
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
			    	  
			          self.polys[i] = svg.append("polygon")
					   .attr("points", item.polyPoints)
					   .style("fill", "green")
					   .style("fill-opacity", 0.1)
					   .style("stroke", "red")
					   .style("strokeWidth", "10px")
			      
			    }
		  }

		  
		}
		
		overlay.setMap(map);

	}
	  
	render() {
	    return (
	    	<div>
	    		<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    		<div id="marker-tooltip"></div>
	    	</div>	
	    )
	}
}

