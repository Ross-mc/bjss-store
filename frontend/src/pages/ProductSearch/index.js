import React, { useEffect, useState } from "react";
import {
    useParams
  } from "react-router-dom";
import Category from '../../components/containers/Category';
import { getProductCategories } from "../../mockService";


export default () => {
    let { type, query } = useParams();

    const [categoryName, setCategoryName] = useState(query);

    useEffect(() => {
      const getCategory = async () => {
        const categories = await getProductCategories();
        const category = categories.find(category => {
          return category.id == query
        })
        return category;
      }
      getCategory().then(category => setCategoryName(category.name))
    });

    
  return (
    <div>
      <h3>Showing Results for: <em>{categoryName}</em></h3>
      <Category type={type} query={query} />
    </div>
  );
};
