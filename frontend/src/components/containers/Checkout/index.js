import React from 'react';
import { Link } from "react-router-dom";
import styles from "./checkout.module.scss";

const Checkout = () => {
  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div className={styles.split}>
          <h3>Shipping Details</h3>
          <form>
            <label className={styles.labelsForm}>
              Name:
              <input className={styles.fieldsForm} type="text" name="name"/><br></br>
            </label>
            <label className={styles.labelsForm}>
              Address:
              <input  className={styles.fieldsForm} type="text" name="name"/><br></br>
            </label>
            <label>
              City:
              <input className={styles.fieldsForm} type="text" name="name"/><br></br>
            </label>
            <label>
              Post Code:
              <input className={styles.fieldsForm} type="text" name="name"/><br></br>
            </label>
            <label>
              Country:
              <input className={styles.fieldsForm} type="text" name="name"/><br></br>
            </label>
          </form>
        </div>
        <div className={styles.split}>
          <h3>Payment Details</h3>
        </div>
        <br />
        <div className={styles.flex}>
          <hr />
          <Link to="/basket">
          <button className={styles.cancel} target="/basket">Cancel</button>
          </Link>
          <Link to="/payment">
          <button className={styles.proceed}>Proceed</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
