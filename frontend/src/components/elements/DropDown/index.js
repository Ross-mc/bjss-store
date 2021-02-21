import React, { useState, useRef, useEffect } from "react";
import styles from "./dropDown.module.scss";
import { Link } from "react-router-dom";
import IconButton from "../iconElements/IconButton";
import { icons } from "../../elements/iconElements";

export default ({ renderDropdown }) => {
  const [openState, setOpenState] = useState(false);
  const [coordinates, setCoordinates] = useState([0, 0]);

  const wrapperRef = useRef(null);

  const clickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenState(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [wrapperRef]);

  const getCoordinates = (el) => {
    if (el) {
      const { left, bottom } = el.getBoundingClientRect();
      if (left !== coordinates[0] || bottom !== coordinates[1]) {
        setCoordinates([left, bottom]);
      }
    }
  };

  const showDropDown = () => (
    <div
      ref={wrapperRef}
      className={styles.dropDownContainer}
      style={{ left: coordinates[0], top: coordinates[1] }}
    >
      {renderDropdown && renderDropdown()}
    </div>
  );

  return (
    <React.Fragment>
      <span ref={getCoordinates}>
      <IconButton
        onClick={() => {
          openState || setOpenState(true);
        }}
        
        icon={icons.BARS}
      />
      </span >
      {openState && showDropDown()}
    </React.Fragment>
  );
};

export const renderLinkList = (list, baseUrl) => {
  return () => {
    const renderList = () =>
      list.map((listItem) => {
        return (
          <li key={listItem.id}>
            <Link to={`${baseUrl}/${listItem.id}`}>{listItem.display}</Link>
          </li>
        );
      });

    return <ul>{renderList()}</ul>;
  };
};
