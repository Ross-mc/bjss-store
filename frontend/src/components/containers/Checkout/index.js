import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice } from "../../../state/reducers/basketSlice";
import { connect } from "react-redux";

import React from "react";

// const mapStateToProps = (state) => {
 
//   const { basket } = state.basket;
//   const totalBasketPrice = parseFloat(getTotalPrice(basket)).toFixed(2);
//   return {
//     status: "succeeded",
//     products: basket,
//     total: `£${totalBasketPrice}`,
//     tileOrientation: "column"
//   };
// };

// const mapDispatchToProps = (dispatch) => ({
//   removeFromBasket: (product) => {
//     dispatch(removeFromBasket(product));
//   },
// });

// const Basket = connect(mapStateToProps, mapDispatchToProps)(ProductList);

const Checkout = () => {
    return (
        <div>
            <h2>Checkout</h2>
            
        </div>
    )
}

export default Checkout;
