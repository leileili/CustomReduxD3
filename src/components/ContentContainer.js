import React from 'react'
import TableView from './TableView'
import {connect} from 'react-redux'
import cm from '../common/CommunicationManager'
import rs from '../common/RemoteServices'
import MapD3View from './MapD3View'
import '../common/common.css'

class _ContentContainer extends React.Component{
	constructor() {
		super()
		this.state = {"currentView":"map","enableFilter":false}
		this.url = "http://coolshare.com/leili/projects/annotatedData.geojson";
		
		cm.subscribe("annotatedData", function(action) {
			this.setState(Object.assign({}, this.state, {"currentView":action.options.currentView}))
		},this);
		
		cm.subscribe("annotatedData", function(){
			this.setState(Object.assign({}, this.state, {"enableFilter":true}))
		},this); 
	}
	handleViewSelection(v) {
		this.setState(Object.assign({}, this.state, {"currentView":v}))
		
		setTimeout(function() {
			cm.publish({"type":"/MapD3View/refresh"})
		})
		
	}
	componentDidMount() {
		cm.publish({"type":"/RemoteServices/getAll", "data":{"url":this.url, "options":{"currentView":"map"}}})
	}
	handleChange(e){
		cm.dispatch({"type":"filterData","data":this.refs.filter.value})
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
					<div className={this.state.currentView==="table"?"selectedTab":"unselectedTab"} ><span style={{"marginRight":"50px", "color":"blue", "cursor":"pointer"}} className={this.state.currentView==="table"?"selectedTab":"unselectedTab"} onClick={()=>{this.handleViewSelection("table")}}>Table View</span><span style={{"color":"blue", "cursor":"pointer"}} className={this.state.currentView==="map"?"selectedTab":"unselectedTab"} onClick={()=>{this.handleViewSelection("map")}}>Map View</span><input ref="filter" placeholder="Filter name" style={{"marginLeft":"50px"}} disabled={!this.state.enableFilter} onChange={(e)=>{this.handleChange(e)}}/></div>
					{this.state.currentView==="table" &&<TableView data={tableData}/>}
					{this.state.currentView==="map" &&<MapD3View data={mapData} featureData={tableData}/>}
					
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