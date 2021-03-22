import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import React, { useState } from "react";

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        loginFailed: false
    };
    componentDidMount() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("withCredentials", true)
      // myHeaders.append("Cookie", "connect.sid=s%3A5Njnx9NChxrhW30xfyoLJ-M8w97NLfsP.cs4M2mBBDwRVAhH5aDZdG8v8b%2FrUK5zwyiShkPErnio");
      var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
          credentials: 'include',
          'Access-Control-Allow-Origin': 'http://localhost:3000' 
      };
      fetch("http://localhost:4001/api/account", requestOptions)
          .then(response => {
              if (response.status === 200) {
                 return window.location.href = "/account"
              }

          })
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        // // myHeaders.append("Cookie", "connect.sid=s%3ADSyMF850iT1JlUofh-VVsDGxTjJCzzmH.y58Nebg1BMYqBju4pnB0TmKMNmhL8aQRL6Ns%2FRjvdjw");
        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        //     redirect: 'follow'
        // };

        // fetch("http://localhost:4001/api/account", requestOptions)
        //     .then(response => {
        //         if (response.status === 200) {
        //             return window.location.href = '/account'
        //         }
        //     })
    }


    handleChange(event, elemToUpdate) {
        const value = event.target.value;
        let newState = this.state;
        var stateObject = function () {
            newState[elemToUpdate] = value;
            return stateObject;
        }

        this.setState(stateObject);
    }

    submitLoginHandler = () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("withCredentials", true)
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

        fetch("http://localhost:4001/api/account/sign-in", requestOptions)
            .then(response => {
              console.log(response.headers)
                if (response.status === 200) {
                  console.log(response)
                    return response.text()
                } else {
                    return "invalid Login Credentials"
                }
            })
            .then(result => {
                if (result === "invalid Login Credentials") {
                    this.setState({ loginFailed: true })
                } else {
                  console.log(result)
                    window.location.href = '/'
                }
            })
            //.then(window.location.href = '/')
            .catch(error => console.log('error', error))

    }

    render() {
        return (
            <div>
                <form>
                    <h3>Log In</h3>
                    <div className="form-group">
                        <label className="lead" for="email">Email: </label>
                        <div className="col-sm-20">
                            <input type="email" name="email" id="email" onChange={(event) => this.handleChange(event, 'email')} value={this.state.email} />
                        </div></div>
                    <div className="form-group">
                        <label className="lead" for="password">Password: </label>
                        <div className="col-sm-20">
                            <input type="password" name="name" id="password" onChange={(event) => this.handleChange(event, 'password')} value={this.state.password} />
                        </div></div>
                    {/* <p class="validation" id="name-validation"></p> */}
                    <button type="button" className="btn btn-dark" onClick={this.submitLoginHandler}>Sign In</button>
                    <div className={this.state.loginFailed ? "alert alert-danger" : "d-none"} role="alert">
                        Invalid Login!
            </div>

                </form>
                <p class="lead">Not Registered? Click <Link to="/registration">here</Link></p>
            </div>
        )
    }
}


export default Login;