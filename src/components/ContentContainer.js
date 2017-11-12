import React from 'react'
import TableView from './TableView'
import {connect} from 'react-redux'
import cm from '../common/CommunicationManager'
import rs from '../common/RemoteServices'
import MapD3View from './MapD3View'

class _ContentContainer extends React.Component{
	constructor() {
		super()
		this.state = {"currentView":""}
		
		cm.subscribe("annotatedData", function(action) {
			this.setState(Object.assign({}, this.state, {"currentView":action.options.currentView}))
		},this);
	}
	handleViewSelection(v) {
		this.setState(Object.assign({}, this.state, {"currentView":v}))
	}
	
	render() {
		var data = [];
		var features = this.props.annotatedData;
		var filter = this.props.filterData;
		var tableData = [];
		var mapData = [];
		for (var i=0; i<features.length; i++) {

			var feature = features[i];
			var name = feature.properties.label_name;
			if (name.indexOf(filter)>-1 || filter==="") {
				tableData.push(feature.properties)
				mapData.push({"name":name, "geo":feature.geometry.coordinates[0]})
			}
		}

		return (
				<div>
					<div><span style={{"marginRight":"50px", "color":"blue", "cursor":"pointer"}} onClick={()=>{this.handleViewSelection("table")}}>Table View</span><span style={{"color":"blue", "cursor":"pointer"}} onClick={()=>{this.handleViewSelection("map")}}>Map View</span></div>
					{this.state.currentView==="table" &&<TableView data={tableData}/>}
					{this.state.currentView==="map" &&<MapD3View data={mapData}/>}
					
				</div>
		)
	}
	
}


const ContentContainer = connect(
		  store => {
			    return {
			    	annotatedData: store.CommonReducer.annotatedData,
			    	filterData: store.CommonReducer.filterData
			    	
			    };
			  }
			)(_ContentContainer);
export default ContentContainer