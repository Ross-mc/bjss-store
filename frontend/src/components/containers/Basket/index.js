import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice } from "../../../state/reducers/basketSlice";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
 
  const { basket } = state.basket;
  const totalBasketPrice = parseFloat(getTotalPrice(basket)).toFixed(2);
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
});

const Basket = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default Basket;
