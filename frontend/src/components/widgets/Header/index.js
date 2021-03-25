import React, { useState, useEffect } from "react";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import IconLink from "../../elements/iconElements/IconLink";
import DropDown, { renderLinkList } from "../../elements/DropDown";
import Roundel from "../../elements/Roundel";
import { icons } from "../../elements/iconElements";
import logo from './logo.png';

export default ({
  itemsInBasket = 0,
  categories = [],
  categoryStatus = "idle",
  loadCategories,
}) => {
  const [searchQuery, setSearchQuery] = useState(0);


  useEffect(() => {
    if (categoryStatus === "idle") {
      loadCategories();
    }
  });

  return (
    <div className={styles.header}>
      <DropDown
        renderDropdown={
          categoryStatus === "succeeded" && renderLinkList(categories, '/search/category')
        }
      />
      <Link to="/" style={{width: "300px"}}>
        <img className={styles.brandimg} src={logo} alt="Logo" />
      </Link>

      <Link to="/">
        <h1 className={styles.brandname}>ACME Stores</h1>
      </Link>

      

      <span>
        <input
          id="search"
          type="text"
          className={styles.searchBar}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </span>
      <IconLink icon={icons.SEARCH} target={searchQuery.length ? `/search/query/${searchQuery}`: undefined } />
      <IconLink icon={icons.INVOICE}target="/invoices" />
      <IconLink icon={icons.USER} target={"/login"} />
      <Roundel count={itemsInBasket}><IconLink icon={icons.BASKET} target="/basket" /></Roundel>
    </div>
  );
};
