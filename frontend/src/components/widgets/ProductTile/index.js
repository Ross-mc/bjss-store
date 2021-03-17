import React from "react";
import styles from "./productTile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';

export default ({ product, addToBasket, removeFromBasket }) => {
  return (
    <div
      className={styles.tile}
      onClick={() => {
        console.log(product);
      }}
    >
      <div className={styles.tileGrid}>
        <div className={styles.imageContainer}>
          <FontAwesomeIcon icon={faCamera} />
        </div>
        <h3 className={styles.shortDescription}>{product.shortDescription}</h3>
        <p className={styles.price}>£{product.price}</p>
        {product.quantity && (
          <p className={styles.quantity}>Quantity: {product.quantity}</p>
        )}
        {addToBasket && (
          <button
            className={styles.cta}
            onClick={(e) => {
              e.stopPropagation();
              addToBasket(product);
            }}
          >
            <FontAwesomeIcon icon={faShoppingBasket} /> Add to Basket
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
