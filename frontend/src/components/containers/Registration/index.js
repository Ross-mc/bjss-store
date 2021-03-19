// import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice } from "../../../state/reducers/basketSlice";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import React, { useState } from "react";

const mapStateToProps = (state) => {

  const { basket } = state.basket;
  const totalBasketPrice = parseFloat(getTotalPrice(basket)).toFixed(2);
  return {
    products: basket,
    total: `£${totalBasketPrice}`,
  };
};

const mapDispatchToProps = (dispatch) => ({
  removeFromBasket: (product) => {
    dispatch(removeFromBasket(product));
  },
});

class Registration extends React.Component{
  state = {
    email: "",
    name: "",
    address: "",
    postcode: "",
    password: "",
    repeatPassword: ""
  };

  handleChange(event, elemToUpdate){
    const value = event.target.value;
    let newState = this.state;
    var stateObject = function(){
      newState[elemToUpdate] = value;
      return stateObject;
    }

    this.setState(stateObject); 
  }

  submitRegistrationHandler = () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "connect.sid=s%3ADSyMF850iT1JlUofh-VVsDGxTjJCzzmH.y58Nebg1BMYqBju4pnB0TmKMNmhL8aQRL6Ns%2FRjvdjw");
    const raw = JSON.stringify({
      "email": this.state.email,
      "name": this.state.name,
      "address": this.state.address,
      "postcode": this.state.postcode,
      "password": this.state.password
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:4001/api/account/sign-up", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  render(){
    return (
      <div>
        <form>
          <h3>Register</h3>
          <label for="email">Email: </label>
          <input type="email" name="email" id="email" onChange={(event) => this.handleChange(event, 'email')} value={this.state.email}/>
          <label for="name">Name: </label>
          <input type="text" name="name" id="name" onChange={(event) => this.handleChange(event, 'name')}  value={this.state.name}/>
          <label for="address">Address: </label>
          <input type="text" name="address" id="address" onChange={(event) => this.handleChange(event, 'address')} value={this.state.address}/>
          <label for="postcode">Postcode: </label>
          <input type="text" name="postcode" id="postcode" onChange={(event) => this.handleChange(event, 'postcode')} value={this.state.postcode}/>
          {/* <p class="validation" id="email-validation"></p> */}
          <label for="password">Password: </label>
          <input type="password" name="name" id="password" onChange={(event) => this.handleChange(event, 'password')} value={this.state.password}/>
          <label for="repeatPassword">Re-Enter Password: </label>
          <input type="repeatPassword" name="name" id="repeatPassword" onChange={(event) => this.handleChange(event, 'repeatPassword')} value={this.state.repeatPassword}/>
          {/* <p class="validation" id="name-validation"></p> */}
          <button type="button" onClick={this.submitRegistrationHandler}>Register</button>
  
        </form>
      </div>
    )
  }
}


export default connect(mapStateToProps)(Registration);
