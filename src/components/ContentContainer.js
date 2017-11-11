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
		
		cm.subscribe("houseData", function(action) {
			this.setState(Object.assign({}, this.state, {"currentView":action.data.currentView}))
		})
	}
	handleViewSelection(v) {
		this.setState(Object.assign({}, this.state, {"currentView":v}))
	}
	
	render() {
		var data = [];
		var list = this.props.houseData;
		var filter = this.props.filterData;
		if (filter!=='') {
			for (var i=0; i<list.length; i++) {
				if (list[i].city.indexOf(filter)>-1) {
					data.push(list[i])
				}
			}
		} else {
			data = list
		}
		return (
				<div>
					<div><span onClick={()=>{this.handleViewSelection("table")}}>Table View</span><span onClick={()=>{this.handleViewSelection("map")}}>Map View</span></div>
					{this.state.currentView==="table" &&<TableView data={data}/>}
					{this.state.currentView==="map" &&<MapD3View data={data}/>}
					
				</div>
		)
	}
	
}


const ContentContainer = connect(
		  store => {
			    return {
			    	houseData: store.CommonReducer.houseData,
			    	filterData: store.CommonReducer.filterData
			    	
			    };
			  }
			)(_ContentContainer);
export default ContentContainer