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
                   return response.text()
                }

            }).then(result =>{
                const json = JSON.parse(result)
                this.setState({name: json.name, address: json.address, postcode: json.postcode, email: json.email })
            })
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