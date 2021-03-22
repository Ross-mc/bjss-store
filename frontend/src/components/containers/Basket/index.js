import ProductList from "../../widgets/ProductList";
import { removeFromBasket, getTotalPrice } from "../../../state/reducers/basketSlice";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const { basket } = state.basket;
  return {
    status: "succeeded",
    products: basket,
    total: getTotalPrice(basket)
  };
};

const mapDispatchToProps = (dispatch) => ({
  removeFromBasket: (product) => {
    dispatch(removeFromBasket(product));
  },
});

const Basket = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default Basket;
