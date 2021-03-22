import React from "react";
import styles from "./productTile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";

export default ({ product, addToBasket, removeFromBasket,setSelectedProduct }) => {
  const style = removeFromBasket?styles.basketTile:styles.tile;
  const style2 = product.quantity === 0 ? styles.ctaNo : styles.cta;

  return (
    <div className={style} onClick={() => setSelectedProduct(product)}>
      <div className={styles.tileGrid}>
        <div className={styles.imageContainer}>
          <FontAwesomeIcon icon={faCamera} />
        </div>
        <h3 className={styles.shortDescription}>{product.shortDescription}</h3>
        <p className={styles.price}>£{product.price}</p>
        {product.quantity > 0 && (
          <p className={styles.quantity}>Quantity: {product.quantity}</p>
        )}
        {addToBasket && (
          <button
            className={ style2 }
            onClick={(e) => {
              e.stopPropagation();
              if (product.quantity !== 0) {
                addToBasket(product);
              }
            }}
          >
            <FontAwesomeIcon icon={faShoppingBasket} /> {product.quantity === 0 ? "Out of Stock" : "Add to Basket"}
          </button>
        )}
        {removeFromBasket && (
          <button
            className={styles.secondaryButton}
            onClick={(e) => {
              e.stopPropagation();
              removeFromBasket(product);
            }}
          >
            Remove from Basket
          </button>
        )}
      </div>

    </div>
  );
};
