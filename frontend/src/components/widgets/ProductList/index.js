import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductTile from "../ProductTile";
import styles from "./productList.module.scss";
import style2 from "../ProductTile/productTile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const renderProducts = (
  products,
  addToBasket,
  removeFromBasket,
  setSelectedProduct
) =>
  products.map((product) => (
    <ProductTile
      product={product}
      addToBasket={addToBasket}
      removeFromBasket={removeFromBasket}
      key={product.id}
      setSelectedProduct={setSelectedProduct}
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
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      loadProducts();
    }
  });

  if (status !== "succeeded") {
    return loadingPlaceholder();
  } else {
    return (
      <div className={styles.list}>
        {removeFromBasket &&
          <h1>Your Basket</h1>
        }
        {renderProducts(
          products,
          addToBasket,
          removeFromBasket,
          setSelectedProduct
        )}
        {total && (
          
          <React.Fragment>
            
            <div className={styles.total} id="totalCost">
              <br />
              <hr />
              <p>Total: {total.toFixed(2)}</p>
              <Link to="/checkout">
                <button className={styles.checkoutButton}>Checkout</button>
              </Link>
              
              <br />
            </div>
          </React.Fragment>
        )}
        {selectedProduct && (
          <ProductModal
            {...selectedProduct}
            handleClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    );
  }
};

const ProductModal = ({
  shortDescription,
  longDescription,
  price,
  categoryName,
  handleClose,
}) => {
  return (
    <div className={styles.popupBox}>
      <div className={styles.box}>
        <div className={style2.imageContainer}>
          <FontAwesomeIcon icon={faCamera} />
        </div>
        <h3>{shortDescription}</h3>
        <p>{longDescription}</p>
        <p className={styles.thick}> £ {price}</p>
        <span onClick={handleClose} className={styles.closeIcon}>x</span>
      </div>
    </div>
  );
};

