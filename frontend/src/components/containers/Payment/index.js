import React from "react";
import {Link} from "react-router-dom";

const Payment = () => {
    return (
      <div>
        <h1>Third Party Payment Processing</h1>
        <p>Go back to <Link to="/redirect?url=/">home</Link></p>
      </div>
    );
  }
  
  export default Payment;
