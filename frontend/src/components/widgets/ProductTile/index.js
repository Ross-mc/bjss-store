import React, { useState } from "react";
import styles from "./productTile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';

export default ({ product, addToBasket, removeFromBasket, tileOrientation, increaseQuantity, reduceQuantity, clearBasketProduct }) => {

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
            {/* <img width="100" height="87"  src={`${product.image}`}></img> */}
          </div>
          <h3 className={styles.shortDescription}>{product.shortDescription.replace(/^(.{11}[^\s]*).*/, "$1" + "...")}</h3>
          <h5>
          
            {product.quantityRemaining ? <p>Remaining: {product.quantityRemaining}</p> : <p>Out of Stock</p>  }
          
          </h5>

          <p className={styles.price}>£{parseFloat(product.price).toFixed(2)}</p>
          {product.quantity && (
            <p className={styles.quantity}>Quantity: {product.quantity}</p>
          )}

          {addToBasket && (
            <button
              disabled={!product.quantityRemaining}
              className={styles.cta}
              onClick={(e) => {
                e.stopPropagation();
                addToBasket(product);
              }}
            >
              <FontAwesomeIcon icon={faShoppingBasket} /> Add to Basket
            </button>
          )}

          {/* Basket  */}

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

          {increaseQuantity && (
            <button
              className={styles.secondaryButton}
              onClick={(e) => {
                e.stopPropagation();
                increaseQuantity(product);
              }}
            >
              +
            </button>
          )}

          {reduceQuantity && (
            <button
              className={styles.secondaryButton}
              onClick={(e) => {
                e.stopPropagation();
                reduceQuantity(product);
              }}
            >
              -
            </button>
          )}

          

          {clearBasketProduct && (
            <button
              className={styles.tertiaryProduct}
              onClick={(e) => {
                e.stopPropagation();
                clearBasketProduct(product);
              }}
            >
              Remove Product
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
          <p className={styles.price}>£{parseFloat(product.price).toFixed(2)}</p>
          {product.quantity && (
            <p className={styles.quantity}>Quantity: {product.quantity}</p>
          )}
          {addToBasket && (
            <button
              className={styles.cta}
              onClick={() => addToBasket(product)}
              disabled={!product.quantityRemaining}
            >
              <FontAwesomeIcon icon={faShoppingBasket} /> Add to Basket
            </button>
          )}

          {/* Basket */}

          {/* {removeFromBasket && (
            <button
              className={styles.secondaryButton}
              onClick={() => removeFromBasket(product)}
            >
              Remove from Basket
            </button>
          )} */}


          {removeFromBasket && (
            <button
              className={styles.secondaryButton}
              onClick={() => {
                removeFromBasket(product);
              }}
            >
              Remove from Basket
            </button>
          )}

          {increaseQuantity && (
            <button
              className={styles.secondaryButton}
              onClick={() => {
                increaseQuantity(product);
              }}
            >
              +
            </button>
          )}

          {reduceQuantity && (
            <button
              className={styles.secondaryButton}
              onClick={() => {
                reduceQuantity(product);
              }}
            >
              -
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
