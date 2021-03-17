// import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice } from "../../../state/reducers/basketSlice";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import React from "react";

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

// const nameEl = document.querySelector("#name");
// const emailEl = document.querySelector("#email");
// const normalDeliveryEl = document.querySelector("#normal");
// const validation = document.querySelectorAll(".validation");
// const nameValidation = document.querySelector("#name-validation");
// const emailValidation = document.querySelector("#email-validation");
// const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
// const numbersRegex = /[^a-zA-Z]/g;
// const discountList = document.querySelector("#discount-list");
// const discountInput = document.querySelector("#discount");
// const discountHeader = document.querySelector("#discount-header");

// const inputs = [nameEl, emailEl, discountInput]

// const submitOrderHandler = () => {
//     validation.forEach(elem => {
//         elem.innerHTML = "";
//         // elem.style.display = "none";
//     });
//     const name = nameEl.value;
//     const email = emailEl.value;
//     const isNormalChecked = normalDeliveryEl.checked;
//     if (name.length < 5 || name.length > 50){
//         nameValidation.innerHTML = `Name is ${name.length} characters long. It should be between more than 4 and less than 50`;
//         nameValidation.style.display = "block"
//     };
//     if (email.length < 5 || email.length > 30){
//         emailValidation.innerHTML = `Email is ${email.length} characters long. It should be between more than 4 and less than 30`;
//         nameValidation.style.display = "block"
//     };
//     if (!regexEmail.test(email)){
//         emailValidation.innerHTML = `Email is invalid. Please enter a valid email`;
//         nameValidation.style.display = "block"
//     };

//     if (emailValidation.innerHTML != "" || nameValidation.innerHTML != ""){
//         alert('Your submission details were not correct');
//         return;
//     } else {
//         alert(`Order Successfuly Submitted with ${discountList.children.length} discount codes applied`);
//         discountList.innerHTML = "";
//         inputs.forEach(elem => elem.value = "");
//         discountHeader.style.display = "block"
//         return;
//     }
// }

// const submitDiscountHandler = () => {
//     const listItems = discountList.children;
//     discountHeader.style.display = "block";
//     if (listItems.length > 3){
//         alert("You can only have 4 discount codes");
//         return;
//     }
//     const discountCode = discountInput.value;
//     if (discountCode.length !== 10){
//         alert(`Your discount code is ${discountCode.length} characters. It should be 10 characters long`);
//         return
//     } else if (numbersRegex.test(discountCode)){
//         alert("Your discount code can only contain letters")
//     } else {
//         const newLi = document.createElement("li");
//         newLi.innerHTML = discountCode;
//         discountList.appendChild(newLi);
//         discountInput.value = ""
//     }
// }


const Checkout = ({products, total}) => {
    return (
        <div>
            <h2>Checkout</h2>
            <p>Total price is {total}</p>
            <Link to="/payment">Go to payment</Link>
            <form>
                <h3>Order Form</h3>
                <label for="name">Name: </label>
                <input type="text" name="name" id="name" />
                <p class="validation" id="name-validation"></p>
                <label for="email">Email: </label>
                <input type="email" name="email" id="email" />
                <p class="validation" id="email-validation"></p>
                <p>Delivery Method: </p>
                <input type="radio" id="normal" name="delivery" value="normal" checked />
                <label for="normal">Normal</label><br />
                <input type="radio" id="express" name="delivery" value="express" />
                <label for="express">Express</label><br />
                <br />
                <label for="discount-code">Enter Discount Code (Max 4)</label>
                <input type="text" name="discount-code" id="discount" />
                <div class="discount-container">
                    <h3 id="discount-header">Discount Codes Entered</h3>
                    <ol id="discount-list"></ol>
                </div>
                <button type="button" id="discount-btn" /*onclick={submitDiscountHandler}*/>Submit Discount Code</button>
                <button type="button" id="order-btn" /*onclick={submitOrderHandler}*/>Order Button</button>
            </form>
        </div>
    )
}


export default connect(mapStateToProps)(Checkout);
