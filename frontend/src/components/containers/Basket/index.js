import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice, addToBasket, clearBasketProduct } from "../../../state/reducers/basketSlice";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
 
  const { basket } = state.basket;
  const totalBasketPrice = getTotalPrice(basket);
  return {
    status: "succeeded",
    products: basket,
    total: `£${totalBasketPrice}`,
    tileOrientation: "column"
  };
};

const mapDispatchToProps = (dispatch) => ({
  reduceQuantity: (product) => {
    dispatch(removeFromBasket(product));
  },
  // addToBasket: (product) => {
  //   dispatch(addToBasket(product))
  // }
  increaseQuantity: (product) => {
    dispatch(addToBasket(product));
  },
  clearBasketProduct: (product) => {
    dispatch(clearBasketProduct(product));
  }
});

const Basket = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default Basket;
