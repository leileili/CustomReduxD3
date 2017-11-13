import React, { Component } from 'react';
import * as d3 from "d3";
import './map.css'

export default class MapD3View_test extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		d3.json("./annotatedData.geojson", function(error, main) {
			  alert(error)
			})
		  function main(json) {

		    var map = new google.maps.Map(document.getElementById('map'), {
		      zoom: 15,
		      mapTypeId: google.maps.MapTypeId.ROADMAP,
		      center: new google.maps.LatLng(38.854865, -76.958104),       
		    });

		    var overlay = new google.maps.OverlayView(); 
		    overlay.onAdd = function () {

		      var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "SvgOverlay");
		      var svg = layer.append("svg");
		      var gunmalayer = svg.append("g").attr("class", "AdminDivisions");
		      var markerOverlay = this;
		      var overlayProjection = markerOverlay.getProjection();

		      var googleMapProjection = d3.geoTransform({point: function(x, y) {
		        d = new google.maps.LatLng(y, x);
		        d = overlayProjection.fromLatLngToDivPixel(d);
		        this.stream.point(d.x + 4000, d.y + 4000);
		      }
		                                                });
		      var path = d3.geoPath().projection(googleMapProjection);　

		      overlay.draw = function () {

		        gunmalayer.selectAll("path")
		          .data(json.features.geometry.coordinates)
		          .attr("d", path) 
		          .enter().append("path")
		          .attr("d", path)
		          .attr("class", function(d) { return "gunma" + d.id; });

		        var grad = d3.scaleLinear().domain([0, 38]).range(["#0000FF", "#FFFFFF"]);
		        for(var i=0; i < 36+1; i++){
		          d3.select(".gunma"+i).attr("fill", grad(i));
		        }
		      };
		    };

		    overlay.setMap(map);


		  };
		  
	}
	render() {
	    return (
	    		<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
	    		
	    )
	}
}

