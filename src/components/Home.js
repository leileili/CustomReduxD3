import React from "react";
import HeaderContainer from './HeaderContainer'
import { Grid, Row, Col } from 'react-bootstrap';
import NavigationContainer from './NavigationContainer'
import ContentContainer from './ContentContainer'

// Home page component
export default class Home extends React.Component {
  // render
  render() {
    return (
  		
      <div >      
      	<HeaderContainer/>
      	<Grid>
			<Row>
 
				<Col sm ={12} md={12}>
					<ContentContainer/>
				</Col>
			</Row>
		</Grid>
      </div>
    );
  }
}


