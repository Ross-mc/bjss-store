import React, { useEffect, useState } from "react";
import {
    useParams
  } from "react-router-dom";
import Category from '../../components/containers/Category';
import { getProductCategories } from "../../mockService";


export default () => {
    let { type, query } = useParams();

    const [displayQuery, setDisplayQuery] = useState(query);

    useEffect(() => {
      const parsedQuery = parseInt(query, 10);
      if (isNaN(parsedQuery)) {
        setDisplayQuery(query);
      } else {
        const getCategory = async () => {
          const categories = await getProductCategories();
          const category = categories.find(category => {
            return category.id == query
          })
          return category;
        }
        getCategory().then(category => setDisplayQuery(category.name))
      }
    }, [query]);

    
  return (
    <div>
      <h3>Showing Results for: <em>{displayQuery}</em></h3>
      <Category type={type} query={query} />
    </div>
  );
};
