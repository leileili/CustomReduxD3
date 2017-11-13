import React from 'react'
import cm from '../common/CommunicationManager'
import {connect} from 'react-redux'
import rs from '../common/RemoteServices'


class _NavigationContainer extends React.Component{
	constructor(){
		super();
		this.id = "NavigationContainer"
		this.state = {'enableFilter':false}
		
		cm.subscribe("annotatedData", function(){
			this.setState(Object.assign({}, this.state, {"enableFilter":true}))
		},this); 
	}

	
	//handleClick(e){
	//	cm.publish({"type":"/RemoteServices/getAll", "data":{"url":this.url, "options":{"currentView":"map"}}})
	//}

	
	handleChange(e){
		cm.dispatch({"type":"filterData","data":this.refs.filter.value})
	}
	
	
	
	render() {
		return (
				<div style={{"height":"100px"}}>
					<input ref="filter" placeholder="Filter name" disabled={!this.state.enableFilter} onChange={(e)=>{this.handleChange(e)}}/>
				</div>
		)
	}
	
}
const NavigationContainer = connect(
		store => {
		    return {
		    	
		    };
		  }
		)(_NavigationContainer);

export default NavigationContainer