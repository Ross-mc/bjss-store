import React from "react";
import "./App.css";

import Home from "./pages/Home";
import Basket from "./pages/Basket";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import ProductSearch from "./pages/ProductSearch";
import Payment from "./pages/Payment";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Header from "./components/containers/Header";
import store from './state/store';

const routes = [
  { path: "/product-search", Component: ProductSearch },
  { path: "/search/:type/:query", Component: ProductSearch },
  { path: "/checkout", Component: Checkout},
  { path: "/payment", Component: Payment},
  { path: "/basket", Component: Basket },
  { path: "/login", Component: Login },
  { path: "/", Component: Home },

];

function App() {
  return (
    <div className="App">
      <Provider store={store}>
         <Router>
         <Header itemsInBasket="3" />
         <Switch>
            {routes.map((route, i) => (
              <Routes key={i} {...route} />
            ))}
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

const Routes = ({ path, Component }) => {
  return <Route path={path} render={(props) => <Component {...props} />} />;
};

export default App;
