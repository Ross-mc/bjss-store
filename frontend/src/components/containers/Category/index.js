import ProductList from "../../widgets/ProductList";
import { connect } from "react-redux";
import { fetchProducts } from "../../../state/reducers/productSlice";
import { addToBasket } from "../../../state/reducers/basketSlice";

const mapStateToProps = (state, { query, type }) => {
  const { status, products, search } = state.products.searchResults;

  return {
    status: search.type === type && search.query === query ? status : 'idle',
    products,
  };
};

const mapDispatchToProps = (dispatch, { query, type }) => ({
  loadProducts: () => {
    dispatch(fetchProducts({type, query}));
  },
  addToBasket: (product) => {
    dispatch(addToBasket(product));
  },
});

const Category = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default Category;
