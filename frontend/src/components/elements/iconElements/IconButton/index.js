import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../iconElement.module.scss';

export default ({ icon, onClick }) => (
  <button onClick={onClick} className={styles.iconButton}>
    <FontAwesomeIcon icon={icon} />
  </button>
);
