import React from "react";
import styles from './roundel.module.scss'

export default ({count=0, showOnZero=false, children}) => (
    <span className={styles.container}>
        {children}
        { (showOnZero || count !== 0)  && (<div className={styles.roundel}>{count}</div>)}
    </span>
)