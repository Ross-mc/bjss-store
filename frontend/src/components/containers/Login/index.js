import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import React, { useState } from "react";

  class Login extends React.Component{
    state = {
      email: "",
      password: "",
      loginFailed: false
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
  
    submitLoginHandler = () => {
  
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
  
      fetch("http://localhost:4001/api/account/sign-in", requestOptions)
        .then(response => {
            if(response.status === 200){
                return response.text()
            }else{
                return "invalid Login Credentials"
            }
        })
        .then(result => {
            if(result === "invalid Login Credentials"){
                this.setState({loginFailed: true})
            }else{
                window.location.href = '/'
            }
        })
        //.then(window.location.href = '/')
        .catch(error => console.log('error', error))
        
    }
  
    render(){
      return (
        <div>
          <form>
            <h3>Log In</h3>
            <label for="email">Email: </label>
            <input type="email" name="email" id="email" onChange={(event) => this.handleChange(event, 'email')} value={this.state.email}/>
            
            <label for="password">Password: </label>
            <input type="password" name="name" id="password" onChange={(event) => this.handleChange(event, 'password')} value={this.state.password}/>
            {/* <p class="validation" id="name-validation"></p> */}
            <button type="button" onClick={this.submitLoginHandler}>Sign In</button>
            <div className={this.state.loginFailed ? "alert alert-danger" : "d-none"} role="alert">
                 Invalid Login!
            </div>
    
          </form>
        </div>
      )
    }
  }
  
  
export default Login;