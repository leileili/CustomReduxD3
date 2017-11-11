import React, { Component } from 'react';
import * as d3 from "d3";

export default class MapD3View extends Component {
	constructor(props) {
		super(props);
	}
	NEDidMount() {
		let self = this;

		this.initMap()
		this.setMap()

	}
	
	drawMap() {
		var self = this
		var projection = this.overlay.getProjection(),
				padding = 10;
	
		var marker = this.layer.selectAll("svg")
	          .data(d3.entries(self.data))
	          .each(transform) // update existing markers
	        .enter().append("svg")
	          .each(transform)
	          .attr("class", "marker");
	
	      // Add a circle.
		marker.append("circle")
	          .attr("r", 4.5)
	          .attr("cx", padding)
	          .attr("cy", padding);
	
	      // Add a label.
		marker.append("text")
	          .attr("x", padding + 7)
	          .attr("y", padding)
	          .attr("dy", ".31em")
	          .text(function(d) { return d.key; });
	
		function transform(d) {
	        d = new google.maps.LatLng(d.value.lat, d.value.lng);
	        d = projection.fromLatLngToDivPixel(d);
	        return d3.select(this)
	            .style("left", (d.x - padding) + "px")
	            .style("top", (d.y - padding) + "px");
		}
    }
	initMap() {
		this.map = new google.maps.Map(d3.select("#map"), {
			  zoom: 8,
			  center: new google.maps.LatLng(37.76487, -122.41948),
			  mapTypeId: google.maps.MapTypeId.TERRAIN
			});
	
			// Load the station data. When the data comes back, create an overlay.
			
	}
	setMap() {
		var self = this;
		this.data = [{ "type": "Feature", "id": 0, "properties": { "name": "Naylor Gardens", "cartodb_id": 10, "objectid": 10, "web_url": "http:\/\/op.dc.gov", "label_name": "Naylor \r\nGardens", "datelastmo": "2003\/04\/10 00:00:00+00", "shape_leng": 2986.253185, "shape_area": 559270.429390, "2010": null, "2011": 2, "2012": 1, "2013": null, "2014": null, "total": 3.000000 }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -76.958104, 38.854865 ], [ -76.962013, 38.851817 ], [ -76.962884, 38.851922 ], [ -76.964408, 38.853257 ], [ -76.965626, 38.854592 ], [ -76.96737, 38.856846 ], [ -76.967644, 38.857513 ], [ -76.968181, 38.858851 ], [ -76.968198, 38.859638 ], [ -76.968208, 38.860248 ], [ -76.966929, 38.859914 ], [ -76.96475, 38.860735 ], [ -76.958924, 38.859288 ], [ -76.958927, 38.858786 ], [ -76.958964, 38.857259 ], [ -76.958974, 38.856515 ], [ -76.958612, 38.855313 ], [ -76.958104, 38.854865 ] ] ] } }]

			
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

	
	drawDiagram(tab, nodes, linkMap, filter, forceReload) {
		
		
		var self = this;
		if (self.svg!==undefined) {
			if (forceReload) {
				d3.selectAll("svg").remove();
				self.svg=undefined
			} else {
				return
			}
		
			
		}
		if (nodes.length===0) {
			return;
		}
		var dx = 150, dy = 150;	
		
		
		
		var j = 0;

		
		var radius = rings[j][1];
		var width = (radius * 2) + 50;
        var height = (radius * 2) + 50;
        var x0 = nodes[0].xx = width/2+dx;
		var y0 = nodes[0].yy = height/2+dy;
		self.filteredMap = {};
		for (var i=1, k=0; i<nodes.length; i++, k++) {
			var n = nodes[i];
			
			if (filter!==undefined) {
				  if (n.label.toLowerCase().indexOf(filter)<0 || n.id==="_WAN_") {						  
					  self.filteredMap[n.id] = n;
					  continue;
				  }
			}
			
			n.angle = (k / (Math.min(rings[j][0], nodes.length)/2)) * Math.PI; // Calculate the angle at which the element will be placed.
                                                // For a semicircle, we would use (i / numNodes) * Math.PI.
			var x = (radius * Math.cos(n.angle)) + (width/2) + rings[j][2]; // Calculate the x position of the element.
			var y = (radius * Math.sin(n.angle)) + (height/2)+ rings[j][3]; // Calculate the y position of the element.
			n.xx = x+dx;
			n.yy = y+dy;
			if (k>rings[j][0]) {
				k = 0
				j++;
				radius = rings[j][1];
				width = (radius * 2) + 50;
		        height = (radius * 2) + 50;
			}
		}

		var width = 1200, height = 1200;
		self.svg = d3.select("#svg").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .on("mousemove", function() {
		    	  if (self.dragLine!==undefined) {
		    		  var e = d3.event;
		    		  
		    		  self.dragLine.attr("x1",self.dragX)
		                 .attr("y1",self.dragY)
		                 .attr("x2",e.clientX)
		                 .attr("y2",e.clientY-110);
		    		  //console.log("x="+e.clientX+" y="+e.clientY)
		    		  //self.dragLine.attr("transform", "translate(" + e.clientX + "," + e.clientY + ")")
		    	  }
		      })
		      .on("mouseup", (d)=>{
					self.handleMouseUp(d);
					var selectedTab = self.getValue("selectedTab")
					if (selectedTab==="Carrier") {
						self.dispatch({"type":"setSelectedTenantId", "data":undefined})
					} else if (selectedTab==="Tenant") {
						self.dispatch({"type":"setSelectedSiteId", "data":undefined})
					}
					
					self.animateDetails(false)
					self.involveNode = false;
				})
			  .on("click", (d)=>{
				  
				  var overLink = self.getValue("overLink")
				  if (overLink) {
					  
				  ////debugger
					  self.dispatch({"type":"setSelectedLink", "data":overLink})		
				  }
			  })
	/*		  
		var g = self.svg.append("g")	  
		g.append("line")
		.style("stroke", "#000")
		.style("stroke-width", 2)
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 100)
		.attr("y2", 100)
		.style("cursor", "pointer")*/	  
		self.update(tab, nodes, linkMap, filter);
	}
	
	

	update(tab, nodes, linkMap, filter) {
		  var self = this;
		  var selectedTenant = this.getValue("selectedTenant")
		  var filteredMap = {};
		  var wan = selectedTenant.internetForTenant;
		  var devices = this.getValue("CPEDevices");
		  var linkMap = selectedTenant.linkMap = {}
		  var selectedLink = this.getValue("selectedLink")
		  for (var i=0; i<devices.length; i++) {
			  var device = devices[i];
			  var node = self.getItem(device.siteId)
			  if (node===undefined || self.filteredMap[node.id]!==undefined || !device.linked) {
				  continue;
			  }
			  var src = selectedTenant.siteMap[wan.id];
			  var tar = node
			  var id = src.id+"_"+tar.id
			  var link = selectedTenant.linkMap[id] = {"source":src, "target":tar};
				
			  var g = link.g = self.svg.append("g").data([link])
			  
			  link.line = g.append("line")
				.style("stroke", ((me)=>{
							return (d) => {	
								return selectedLink===me?"#00F":"#D1D1D1"
							}		
						})(link))
				.style("stroke-width", 2)
				.attr("x1", link.source.xx)
				.attr("y1", link.source.yy)
				.attr("x2", link.target.xx)
				.attr("y2", link.target.yy)
				.style("cursor", "pointer")	  	 
				  	link.line.on("click", ((me)=>{
						return (d) => {		
							
							////debugger
							self.dispatch({"type":"setSelectedLink", "data":me})
							d3.event.stopPropagation();
						}		
					})(link))
					.on("mouseover", ((me)=>{
						return (d) => {	
							self.setStyle(me.line, "stroke-width", "4px");	
							self.setStyle(me.line, "stroke", self.getValue("selectedLink")===me?"#00F":"#D1D1D1");	
							self.setValue("overLink", me)
						}		
					})(link))
					.on("mouseout", ((me)=>{
						return (d) => {	
							setTimeout(()=>{
								
								if (self.getValue("overLink")==me) {
									self.setValue("overLink", undefined);
								}
								self.setStyle(me.line, "stroke-width", "2px");	
							}, 1000)						
											
						}		
					})(link))
			 // }		
		  }
		  
		  for (var i=0; i<nodes.length; i++) {
			  var node = nodes[i];
			  if (self.filteredMap[node.id]!==undefined) {
				  continue;
			  }
			  var g = node.g = self.svg.append("g").attr("class", "node").attr("width", 2*node.r).attr("height", 2*node.r)
			  .attr("transform", "translate(" + node.xx + "," + node.yy + ")")
			  
			  node.c1 = g.append("circle")
			  	.data([node])
				.attr("r", function(d){return d.r;})
				
				.style("stroke-width", 1)    // set the stroke width
				.style("stroke", "black")  
				.style("cursor", function() {return "default"}) 
				.style("fill", function(d) {return stateColors[d.state]})
				.on("click", (d)=>{
					self.involveNode = true;
					self.handleNodeClick(d)
				})
				.on("dblclick", (d)=>{
					self.involveNode = true;
					self.handleNodeDBClick(d)
				})
				.on("mousedown", (d)=>{
					
					self.involveNode = true;
					self.handleMouseDown(d)
				})
				.on("mouseup", (d)=>{
					self.involveNode = true;
					self.handleMouseUp(d)
				})
				.on("mouseover", (d)=>{
					self.involveNode = true;
					self.handleMouseOver(d);
				})
				.on("mouseout", (d)=>{
						self.handleMouseOut(d);
				});	
			  node.c2 = g.append("circle")
			    .data([node])
				.attr("r", function(d){return d.r-5;})
				.style("fill", function(d) {
					var selectedTab = self.getStoreValue("OrchestrationReducer", "selectedTab")
					if (self.props.selectedSiteId==d.id  && selectedTab==="Tenant"|| self.props.selectedTenantId==d.id && selectedTab==="Carrier") {								
						return self	.getValue("selInnerColor")
					} else {
						return d.innerColor;
					}
					
				})  
				.style("cursor", function() {return "default"})
				.on("click", (d)=>{
					self.involveNode = true;
					self.handleNodeClick(d)
				})
				.on("dblclick", (d)=>{
					self.involveNode = true;
					self.handleNodeDBClick(d)
				})
				.on("mousedown", (d)=>{
					self.involveNode = true;
					self.handleMouseDown(d)
				})
				.on("mouseup", (d)=>{
					self.involveNode = true;
					self.handleMouseUp(d)
				})
				.on("mouseover", (d)=>{
					self.involveNode = true;
					self.handleMouseOver(d);
				})
				.on("mouseout", (d)=>{
						self.handleMouseOut(d);
					});	
	
			  node.image = g.append("svg:image").data([node]).attr("xlink:href", function(d) {
	
					return d.icon;
					} )
				.attr("x", function(d) {return d.iconX})
				.attr("y", function(d) {return d.iconY}).attr("width", function(d) {return d.iconW}).attr("height",  function(d) {return d.iconH})  
				.style("cursor", function() {return "pointer"})
				.on("click", (d)=>{
					self.involveNode = true;
					self.handleNodeClick(d)
				})
				.on("dblclick", (d)=>{
					self.involveNode = true;
					self.handleNodeDBClick(d)
				})
				.on("mousedown", (d)=>{
					self.involveNode = true;
					self.handleMouseDown(d)
				})
				.on("mouseup", (d)=>{
					self.involveNode = true;
					self.handleMouseUp(d)
				})
				.on("mouseover", (d)=>{
					self.involveNode = true;
					self.handleMouseOver(d);
				})
			  .on("mouseout", (d)=>{
					self.handleMouseOut(d);
				});	
			  node.text = g.append("text").data([node]).text(function(d) {
				  if (d.label===undefined) {
					  return ""
				  }
				  //return d.angle
				  return d.label.length<22?d.label:d.label.substring(0, 21)+"...";
				} )
				.style("font-size", function(d) { return "12px"; })
			    .attr("dx", "-1.55em").attr("dy", function(d){return d.fontDy});
			    
			  /*if (filter===undefined) {
				  nodes.push(n)
			  } else {
				  if (n.label.toLowerCase().indexOf(filter)<0 && n.label!=="") {						  
					  filteredMap[n.id] = n;
					  continue;
				  }
				  nodes.push(n)
			  }*/
			  
		  } 
	}
	
	handleMouseOut(d) {

		if (this.dragLine!==undefined) {
			d.c1.style("cursor","pointer")
			d.c2.style("cursor","pointer")
			d.image.style("cursor","pointer")
			d.text.style("cursor","pointer")
			//console.log("setting cursor to pointer for "+d.label)
		}
	}
	handleMouseOver(d) {

		if (this.dragLine!==undefined) {
			this.dndTar = d;
		} else {
			return;
		}
		var self = this;
		
		if (this.dndSrc) {
			if (this.dndSrc.id!=="_WAN_") {
				if (d.id!=="_WAN_") {
					
				//console.log("setting cursor to no-drop for "+d.label)
					//d.g.attr("cursor", "no-drop")	
					self.setStyle(d.text, "cursor", "no-drop")					
					self.setStyle(d.c1, "cursor", "no-drop")
					self.setStyle(d.c2, "cursor", "no-drop")
					self.setStyle(d.image, "cursor","no-drop")
					//d3.select("body").style("cursor", "no-drop");
					return;
				} 
			}
			
		}

		
	}
	handleMouseDown = (d) => {
		d3.event.preventDefault();
		if (this.props.selectedTab!=="Tenant") {
			return;
		}
		var self = this;
		d3.event.preventDefault();
		this.noDrag = false;
		this.dragTimer = setTimeout(()=> {
			//console.log("start drag")
			self.startDrag(d)
		}, 400)
	}
	
	handleMouseUp = (d) => {
		
		d3.event.stopPropagation();
		d3.event.preventDefault();

		if (this.props.selectedTab!=="Tenant") {
			return;
		}
		
		if (d) {
			d.c1.style("cursor","pointer")
			d.c2.style("cursor","pointer")
			d.image.style("cursor","pointer")
			d.text.style("cursor","pointer")
		}
		
		
		var self = this;
		this.noDrag = true;
		if (self.dragTimer) {
			//console.log("end drag")
			clearTimeout(self.dragTimer);
		}

		
		
		if (this.dragLine!==undefined) {
			this.addSiteLink();
		}
		
		
		d3.select("#dragLine").remove();
		self.dragLine = undefined;
		//console.log("===>remvoe dragLine")

	}
	
	addSiteLink = () => {	
		if ( this.dndTar===undefined || this.dndSrc.id!="_WAN_" && this.dndTar.id!="_WAN_") {
			return;
		}
		var site = this.dndSrc.id==="_WAN_"?this.dndTar:this.dndSrc;
		if (site.device && site.device.linked) {
			this.showAlert("The site has already linked")
			return
		}
		this.dispatch({"type":"setNewLink", "source":this.dndSrc.id, "target":this.dndTar.id})
		var optionsMap = {"alertMethod":()=>{return self.getDebugInfo()["alertMethod"]}}
		this.popup2({"data":{}, "schemaName":"Tenants", "optionsMap":optionsMap, "handleOK": () => {
		    			var data = this.collectFields();
		    			var action = this.refs.ok.innerText==="OK"?"create":"edit"
		    			var params = []
		    			if (action=="edit") {
		    				params.push(this.getValue("selectedTenant").id)
		    			}
		    			params.push(data)
		    			this.dispatch({"type":"/GeneralService/"+action, "params":params,"options":{"key":"tenants", "tenantId":this.getValue("selectedTenantId"), "response":(data2)=>{
		    				self.dispatch([{"type":"setCarrierDirty"},{"type":"refreshCarrierDiagram"},{"type":"ClosePopup"}])

		    			}}});
		    		},
		    			"debugData":{"businessName":"Site"+Math.floor(Math.random()*999), "contactName":["Mark", "Mike", "Mary", "Frank", "John", "Grace"][Math.floor(Math.random()*6)],
		    				"phoneNumber":"4084567890", "email":"abc@dcm.com", "address":" 123 main st, San Jose, CA 95555"}})
		//this.popup(this.getValue("routeData")["AddLink"].component, "AddLink")
		//this.dispatch({"type":"addSiteLink", "data":{"source":this.dndSrc.id, "target":this.dndTar.id, "tab":this.props.selectedTab}})
	}
	  
	render() {
		
		var self = this;
		//console.log("X="+self.state.detailX)
		
	    return (
    		<div style={{"width":"100vw"}}>
    			<div id="map" style={{"width":"100vw", "height":"100vw"}}></div>
		    	
			</div>
	    )
	}
}

