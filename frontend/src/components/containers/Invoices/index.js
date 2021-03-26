import React, { useState, useEffect } from "react";
// import TodaysDeals from '../../components/containers/TodaysDeals';

export default () => {
  const [savedInvoices, getSavedInvoices] = useState([]);

  useEffect(() => {
    //make api to database
    //retrieve invoices from db
    //updated saved invoices state
    setTimeout(() => {
      getSavedInvoices([{
        "description": "SOCKS-BLACK",
        "discount": "10%",
        "item #": "347-1",
        "line total": "32.40",
        "quantity": "100",
        "sales tax": "0%",
        "subtotal": "32.40",
        "total": "32.40",
        "total discount": "3.60",
        "unit price": "0.36"
      }])
    }, 1000)
  
  }, [])


  return (
    <div style={{ marginBottom: "30px" }}>
      {savedInvoices.length > 0 ?
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Item #</th>
              <th scope="col">Description</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Discount</th>
              <th scope="col">Line Total</th>
              <th scope="col">Total Discount</th>
              <th scope="col">Subtotal</th>
              <th scope="col">Tax</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {savedInvoices.map((invoice, index) => {
              return (
                <tr>
                  <th scope="row">{index}</th>
                  <td>{invoice["item #"]}</td>
                  <td>{invoice["description"]}</td>
                  <td>{invoice["unit price"]}</td>
                  <td>{invoice["discount"]}</td>
                  <td>{invoice["line total"]}</td>
                  <td>{invoice["total discount"]}</td>
                  <td>{invoice["subtotal"]}</td>
                  <td>{invoice["sales tax"]}</td>
                  <td>{invoice["total"]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        : <p>Getting Invoices from Database...</p>}

    </div>
  );
};
