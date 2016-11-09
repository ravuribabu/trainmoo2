import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export default class MyComp extends React.Component {

  constructor(props) {
    super(props)
  }

  render(){
    return (<h1> Hello Kushi </h1>);
  }
 }


ReactDOM.render(
        <MyComp />,
        document.getElementById('container')
      );