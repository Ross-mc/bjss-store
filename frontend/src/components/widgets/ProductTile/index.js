import React, { useState } from "react";
import styles from "./productTile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';

export default ({ product, addToBasket, removeFromBasket, tileOrientation }) => {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={tileOrientation === "column" ? styles.tileColumn : styles.tile} onClick={() => {
        console.log(product);
        setModalOpen(true);
      }}>
        <div className={tileOrientation === "column" ? styles.tileGridColumn : styles.tileGrid}>

          <div className={styles.imageContainer}>
            <FontAwesomeIcon icon={faCamera} />
          </div>
          <h3 className={styles.shortDescription}>{product.shortDescription}</h3>
          <h5>Quantity remaining: {product.stock}</h5>
          <p className={styles.price}>£{product.price}</p>
          {product.quantity && (
            <p className={styles.quantity}>Quantity: {product.quantity}</p>
          )}
          {product.stock == 0 && (
            <p> Out of stock </p>
            
          )}
          {addToBasket && (
            <button
              disabled={!product.stock}
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
      <Modal isOpen={modalOpen} onAfterOpen={() => { console.log('MODAL OPEN') }} onRequestClose={() => { setModalOpen(false) }}>
        <div className={styles.tileGrid}>
          <div className={styles.imageContainer}>
            <FontAwesomeIcon icon={faCamera} />
          </div>
          <h3 className={styles.shortDescription}>{product.longDescription}</h3>
          <p className={styles.price}>£{product.price}</p>
          {product.quantity && (
            <p className={styles.quantity}>Quantity: {product.quantity}</p>
          )}
          {addToBasket && (
            <button
              className={styles.cta}
              onClick={() => addToBasket(product)}
              disabled={!product.stock}
            >
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
        <button onClick={() => {
          setModalOpen(false)
          console.log(modalOpen)
        }}
        >
          Close
      </button>
      </Modal>
    </>
  );
};
