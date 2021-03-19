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

class Registration extends React.Component {
  state = {
    email: "",
    name: "",
    address: "",
    postcode: "",
    password: "",
    repeatPassword: "",
    emailValidated: true,
    nameValidated: true,
    addressValidated: true,
    postcodeValidated: true,
    passwordValidated: true,
    passwordsMatch: true,
    registrationFailed: false
  };

  handleChange(event, elemToUpdate) {
    const value = event.target.value;
    let newState = this.state;
    var stateObject = function () {
      newState[elemToUpdate] = value;
      return stateObject;
    }
    this.setState(stateObject);
  };

  regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

  submitRegistrationHandler = () => {
    this.setState({ emailValidated: true,
      nameValidated: true,
      addressValidated: true,
      postcodeValidated: true,
      passwordValidated: true,
      passwordsMatch: true})
    let validationFailed = false;
    if (!this.regexEmail.test(this.state.email) || this.state.email.length < 5) {
      validationFailed = true;
      this.setState({ emailValidated: false })
      //display on the page
    }
    if (this.state.address.length < 5) {
      validationFailed = true;
      //display on the page
      this.setState({ addressValidated: false })
    }
    if (this.state.postcode.length < 5) {
      validationFailed = true;
      //display on the page
      this.setState({ postcodeValidated: false })
    }
    if (this.state.name.length < 5) {
      validationFailed = true;
      //display on the page
      this.setState({ nameValidated: false })
    }
    if (this.state.password.length < 5) {
      validationFailed = true;
      //display on the page
      this.setState({ passwordValidated: false })
    }
    if (this.state.password !== this.state.repeatPassword) {
      validationFailed = true;
      //display on the page
      this.setState({ passwordsMatch: false })
    }

    if (validationFailed) {
      return
    }


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Cookie", "connect.sid=s%3ADSyMF850iT1JlUofh-VVsDGxTjJCzzmH.y58Nebg1BMYqBju4pnB0TmKMNmhL8aQRL6Ns%2FRjvdjw");
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
    .then(response => {
      if(response.status === 200){
          return response.text()
      }else{
          return "invalid registration"
      }
  })
  .then(result => {
      if(result === "invalid registration"){
          this.setState({registrationFailed: true})
      }else{
          window.location.href = '/login'
      }
  })
  //.then(window.location.href = '/')
  .catch(error => console.log('error', error))
  }


  render() {
    return (
      <div style={{width: "60%", margin: "0 auto"}}>
        <h3>Register</h3>
        <form>
          <div className="form-group">
            <label className="text-left lead" style={{width: "100%"}} for="email">Email: </label>
            <input type="email" name="email" id="email" onChange={(event) => this.handleChange(event, 'email')} value={this.state.email} className="form-control"/>
            <div className={this.state.emailValidated ? "d-none" : "alert alert-danger"} role="alert">
              Invalid Email Address
          </div>
          </div>
          <div className="form-group">
            <label className="text-left lead" style={{width: "100%"}} for="name">Name: </label>
            <input type="text" name="name" id="name" onChange={(event) => this.handleChange(event, 'name')} value={this.state.name} className="form-control"/>
            <div className={this.state.nameValidated ? "d-none" : "alert alert-danger"} role="alert">
              Invalid Name
          </div>
          </div>
          <div className="form-group">
            <label className="text-left lead" style={{width: "100%"}} for="address">Address: </label>
            <input type="text" name="address" id="address" onChange={(event) => this.handleChange(event, 'address')} value={this.state.address} className="form-control"/>
            <div className={this.state.addressValidated ? "d-none" : "alert alert-danger"} role="alert">
              Invalid Address
          </div>
          </div>
          <div className="form-group">
            <label className="text-left lead" style={{width: "100%"}} for="postcode">Postcode: </label>
            <input type="text" name="postcode" id="postcode" onChange={(event) => this.handleChange(event, 'postcode')} value={this.state.postcode} className="form-control"/>
            <div className={this.state.postcodeValidated ? "d-none" : "alert alert-danger"} role="alert">
              Invalid Postcode
          </div>
          </div>
          {/* <p class="validation" id="email-validation"></p> */}
          <div className="form-group">
            <label className="text-left lead" style={{width: "100%"}} for="password">Password: </label>
            <input type="password" name="name" id="password" onChange={(event) => this.handleChange(event, 'password')} value={this.state.password} className="form-control"/>
            <div className={this.state.passwordValidated ? "d-none" : "alert alert-danger"} role="alert">
              Invalid Password
          </div>
          </div>
          <div className="form-group">
            <label className="text-left lead" style={{width: "100%"}} for="repeatPassword">Re-Enter Password: </label>
            <input type="password" name="name" id="repeatPassword" onChange={(event) => this.handleChange(event, 'repeatPassword')} value={this.state.repeatPassword} className="form-control"/>
            <div className={this.state.passwordsMatch ? "d-none" : "alert alert-danger"} role="alert">
              Passwords Don't Match
          </div>
          </div>
          {/* <p class="validation" id="name-validation"></p> */}
          <button type="button" className="btn btn-primary" onClick={this.submitRegistrationHandler}>Register</button>
        </form>
        <div className={this.state.registrationFailed ? "alert alert-danger" : "d-none"} role="alert">
                 Registration Failed. Please try again.
            </div>
      </div>
    )
  }
}


export default connect(mapStateToProps)(Registration);
