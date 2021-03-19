import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import React, { useState } from "react";

// import ProductList from "../../widgets/ProductList";

// const mapStateToProps = (state) => {
//     const { status, products } = state.products.todaysDeals;
//     return {
//       status,
//       products,
//     };
//   };
  
//   const mapDispatchToProps = (dispatch) => ({
//   });
  
//   const Login = connect(mapStateToProps, mapDispatchToProps)(ProductList);

const Login = () => {
  // const [success, setSuccess] = useState(false);
  // const submitOrderHandler = () => {
  //     setSuccess(true);
  // }

  return (
      <div>        
          <form>
              <h3>Login</h3>
              <label for="email">Email: </label>
              <input type="email" name="email" id="email" />
              {/* <p class="validation" id="email-validation"></p> */}
              <label for="password">Password: </label>
              <input type="password" name="name" id="password" />
              {/* <p class="validation" id="name-validation"></p> */}
              <p>Not registered? Click <Link to="/registration" /*onclick={submitDiscountHandler}*/ >Here</Link></p>
          </form>
      </div>
  )
}

export default Login;