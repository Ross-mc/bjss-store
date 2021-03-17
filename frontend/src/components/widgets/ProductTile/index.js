import React from "react";
import styles from "./productTile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";

export default ({ product, addToBasket, removeFromBasket }) => {
  const setActive = (event) => {
    event.preventDefault()
    console.log(event.target);
  }
  return (
    <div className={styles.tile}>
      <div className={styles.tileGrid}>
        <div className={styles.imageContainer}>
          <FontAwesomeIcon icon={faCamera} />
        </div>
        <a href="/" onClick={setActive}>
          <h3 className={styles.shortDescription}>{product.shortDescription}</h3>
        </a>
        <p className={styles.price}>£{product.price}</p>
        {product.quantity && (
          <p className={styles.quantity}>Quantity: {product.quantity}</p>
        )}
        {addToBasket && (
          <button className={styles.cta} onClick={() => addToBasket(product)}>
            <FontAwesomeIcon icon={faShoppingBasket} /> Add to Basket
          </button>
        )}
        {removeFromBasket && (
          <button
            className={styles.secondaryButton}
            onClick={() => removeFromBasket(product)}
          >
            Remove from Basket
          </button>
        )}
      </div>
    </div>
  );
};
