import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import React, { useState } from "react";

class Account extends React.Component {
    state = {
        name: "",
        email: "",
        address: "",
        postcode: ""
    };
    componentDidMount() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "connect.sid=s%3ADSyMF850iT1JlUofh-VVsDGxTjJCzzmH.y58Nebg1BMYqBju4pnB0TmKMNmhL8aQRL6Ns%2FRjvdjw");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        console.log(this.checkCookie())
        // fetch("http://localhost:4001/api/account", requestOptions)
        //     .then(response => {
        //         console.log(response)
        //         if (response.status === 200) {
        //            return response.text()
        //         }

        //     }).then(result =>{
        //         console.log(result)
        //         this.setState({name: result.name, address: result.address, postcode: result.postcode, email: result.email })
        //     })
    }

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
      checkCookie() {
        var username = this.getCookie("http://localhost:3000=connect.sid");
        // 
        return username
      }

    render() {
        return (
            <div>
                <h3>Name: {this.state.name}</h3>
                <h3>Email: {this.state.email}</h3>
                <h3>Address: {this.state.address}</h3>
                <h3>Postcode: {this.state.postcode}</h3>
            </div>
        )
    }
}


export default Account;