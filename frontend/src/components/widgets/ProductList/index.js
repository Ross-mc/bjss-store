import React, { useEffect } from "react";
import ProductTile from "../ProductTile";
import { Link } from 'react-router-dom';
import { clearBasketProduct } from "../../../state/reducers/basketSlice";


const renderProducts = (products, addToBasket, removeFromBasket, tileOrientation, increaseQuantity, reduceQuantity, clearBasketProduct) =>
  products.map((product) => (
    <ProductTile
      product={product}
      addToBasket={addToBasket}
      removeFromBasket={removeFromBasket}
      key={product.id}
      tileOrientation={tileOrientation}
      increaseQuantity={increaseQuantity}
      reduceQuantity={reduceQuantity}
      clearBasketProduct={clearBasketProduct}
    />
  ));

const loadingPlaceholder = () => <span>LOADING...</span>;

export default ({
  products,
  status = "idle",
  loadProducts,
  addToBasket,
  removeFromBasket,
  total,
  tileOrientation,
  increaseQuantity,
  reduceQuantity,
  clearBasketProduct
}) => {
  useEffect(() => {
    if (status === "idle") {
      loadProducts();
    }
  });

  if (status !== "succeeded") {
    return loadingPlaceholder();
  } else {
    return (
      <div>
        {renderProducts(products, addToBasket, removeFromBasket, tileOrientation, increaseQuantity, reduceQuantity, clearBasketProduct)}
        {total && (
          <React.Fragment>
            <br/>
            <hr />
            <div>Total: {total} </div>
            {/* <Link to="/payment">Go to payment</Link>  */}
            <Link to="/checkout">Go to checkout</Link> 
          </React.Fragment>
        )}
      </div>
    );
  }
};
