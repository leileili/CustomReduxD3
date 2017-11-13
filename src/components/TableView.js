import React from 'react'
import { BootstrapTable,TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import ContentContainer from './ContentContainer'
import cm from '../common/CommunicationManager'

export default class TableView extends React.Component{
	render() {
		return (
				<div style={{"height":"300px"}}>
					<p> Here are the data loaded from a json file.</p>
					<BootstrapTable data={ this.props.data } maxHeight="400px" hover={true} striped={true}>
				        <TableHeaderColumn dataField='name' isKey>name</TableHeaderColumn>
				        <TableHeaderColumn dataField='shape_leng'>shape_leng</TableHeaderColumn>
				        <TableHeaderColumn dataField='shape_area'>shape_area</TableHeaderColumn>
				        <TableHeaderColumn dataField='total'>total</TableHeaderColumn>				        
				      </BootstrapTable>	

				</div>
		)
	}
	
}
