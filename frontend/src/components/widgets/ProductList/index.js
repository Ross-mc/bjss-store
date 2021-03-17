import React, { useEffect } from "react";
import ProductTile from "../ProductTile";
import { Link } from 'react-router-dom';


const renderProducts = (products, addToBasket, removeFromBasket, tileOrientation) =>
  products.map((product) => (
    <ProductTile
      product={product}
      addToBasket={addToBasket}
      removeFromBasket={removeFromBasket}
      key={product.id}
      tileOrientation={tileOrientation}
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
  tileOrientation
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
        {renderProducts(products, addToBasket, removeFromBasket, tileOrientation)}
        {total && (
          <React.Fragment>
            <br/>
            <hr />
            <div>Total: {total} </div>
            <Link to="/payment">Go to payment</Link> 
          </React.Fragment>
        )}
      </div>
    );
  }
};
