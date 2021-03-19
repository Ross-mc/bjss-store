import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice, addToBasket } from "../../../state/reducers/basketSlice";
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
  removeFromBasket: (product) => {
    dispatch(removeFromBasket(product));
  },
  addToBasket: (product) => {
    dispatch(addToBasket(product))
  }
});

const Basket = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default Basket;
