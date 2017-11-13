import React from 'react'
import {connect} from 'react-redux'
import { browserHistory } from 'react-router';
import '../common/common.css'

class _HeaderContainer extends React.Component{
	constructor() {
		super()
		this.state = {"currentLink":"demo"}
	}
	handleLink(e, url) {
		var self = this
		browserHistory.push(url)
		setTimeout(function() {
			self.setState(Object.assign({}, self.state, {"currentLink":url}))
		})
		
	}
	render() {
		return (
				<div style={{"margintop":"auto", "marginBottom":"10px"}}>
					<span className={this.state.currentLink==="demo"?"selectedTab":"unselectedTab"}  style={{"marginRight":"50px", "color":"blue", "cursor":"pointer"}} onClick={(e)=>{this.handleLink(e, "demo")}}>Demo</span>
					<span className={this.state.currentLink==="about"?"selectedTab":"unselectedTab"}  style={{"marginRight":"50px", "color":"blue", "cursor":"pointer"}} onClick={(e)=>{this.handleLink(e, "about")}}>About</span>					
				</div>
		)
	}
	
}
const HeaderContainer = connect(
		  store => {
			    return {
			    	
			    };
			  }
			)(_HeaderContainer);
export default HeaderContainer