import ProductList from "../../widgets/ProductList";
import { connect } from "react-redux";
import { fetchTodaysDeals } from "../../../state/reducers/productSlice";
import { addToBasket } from "../../../state/reducers/basketSlice";

const mapStateToProps = (state) => {
  const { status, products } = state.products.todaysDeals;
  return {
    status,
    products,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadProducts: () => {
    dispatch(fetchTodaysDeals());
  },
  addToBasket: (product) => {
    dispatch(addToBasket(product));
  },
});

const TodaysDeals = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default TodaysDeals;
