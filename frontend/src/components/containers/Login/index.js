import { connect } from "react-redux";
import ProductList from "../../widgets/ProductList";

const mapStateToProps = (state) => {
    const { status, products } = state.products.todaysDeals;
    return {
      status,
      products,
    };
  };
  
  const mapDispatchToProps = (dispatch) => ({
  });
  
  const Login = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default Login;