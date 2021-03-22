import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../iconElement.module.scss';

export default ({ icon, target }) => (
    <Link to={target} className={styles.iconButton}><FontAwesomeIcon icon={icon} /></Link>
);
