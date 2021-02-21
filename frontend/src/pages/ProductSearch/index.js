import React from "react";
import {
    useParams
  } from "react-router-dom";
import Category from '../../components/containers/Category';


export default () => {
    let { type, query } = useParams();
  return (
    <div>
      <h3>Showing Results for: <em>{query}</em></h3>
      <Category type={type} query={query} />
    </div>
  );
};
