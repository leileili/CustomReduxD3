import React from 'react'
import cm from '../common/CommunicationManager'
import {connect} from 'react-redux'
import rs from '../common/RemoteServices'


class _NavigationContainer extends React.Component{
	constructor(){
		super();
		this.id = "NavigationContainer"
		
	}

	
	render() {
		return (
				<div style={{"height":"100px"}}>					
					<p>This is the navigation area but still under construction</p>
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