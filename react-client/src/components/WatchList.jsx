import React from 'react';
import {Route, Switch, PropsRoute} from 'react-router-dom'
import { Grid, Row, Col} from 'react-bootstrap';
import ProductChart from './ProductChart.jsx';
import $ from 'jquery';
import Header from './Header.jsx'
var data = require('../mockData.js');


class WatchListItem extends React.Component {

  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this);
    this.fetch = this.fetch.bind(this);
    this.changeState = this.changeState.bind(this);
    this.state = {
      items: this.props.items

    }
  }

  ComponentDidMount() {
    this.fetch((data) => {
      this.changeState(data);
    });   
  }

  changeState(data) {
    this.setState({
      items: JSON.parse(data)
    })
  }

  fetch (cb) {
    $.ajax({
      url: '/watchlist',
      type: 'GET',
      success: (data) => {
        cb(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleRemove(itemToRemove) {
    itemToRemove.itemId
    var filteredArary = this.state.items.filter((item) => { return (item.itemId !== itemToRemove.itemId) })
    this.setState({
      items:filteredArary
    })
    $.ajax({
      url: '/watchedItem',
      method: 'DELETE',
      data: {'itemId': itemToRemove.itemId},
      success: () => {
        console.log('Item removed');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  render() {

  var listItems = this.state.items.map((item) =>
    <li key={item.itemId.toString()}>
      <h4> {item.name} </h4>
      <img src={item.mediumImage} />
      <ProductChart data={item} />
      <input type="submit" value="Remove from watchlist" onClick={()=> this.handleRemove(item)} />

    </li>
    );

  return (
    <ul> {listItems} </ul>
    )
  }

}


const WatchList = function(props) {

  return (<Grid>

  <Header />

  <Row className="show-grid">
    <Col md={2} xs={2}>
    </Col>

    <Col md={8} xs={8}>
      <WatchListItem items={data.mockGraphData}/>
    </Col>

    <Col md={2} xs={2}>
    </Col>
  </Row>


  <Row className="show-grid">
    <Col md={12} xs={12}>
      <br />
      "contact-us: xxx-xxx-xxxx"
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </Col>
  </Row>

</Grid>)
}


export default WatchList