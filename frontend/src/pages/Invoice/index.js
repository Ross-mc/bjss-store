import React from "react";
import Invoice from '../../components/containers/Invoice';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <h2>Invoices</h2>
    <p class="lead">Click <Link to="/invoices">here</Link> to view previous invoices</p>
    <Invoice />
  </div>
);
