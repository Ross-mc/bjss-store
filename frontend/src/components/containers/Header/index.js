import Header from "../../widgets/Header";
import { connect } from "react-redux";
import { getBasketSize } from "../../../state/reducers/basketSlice";
import { fetchProductCategories } from "../../../state/reducers/productSlice";

const mapStateToProps = (state) => ({
  itemsInBasket: getBasketSize(state.basket.basket),
  categories: state.products.categories.categories.map(({ name, id }) => ({
    display: name,
    id,
  })),
  categoryStatus: state.products.categories.status,
});

const mapDispatchToProps = (dispatch) => ({
  loadCategories: () => {
    dispatch(fetchProductCategories());
  },
});

const ConnectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header);

export default ConnectedHeader;
