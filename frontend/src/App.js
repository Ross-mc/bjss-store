import React from "react";
import "./App.css";

import Home from "./pages/Home";
import Account from "./pages/Account";
import Basket from "./pages/Basket";
import Login from "./pages/Login";
import ProductSearch from "./pages/ProductSearch";
import Payment from "./pages/Payment";
import Redirect from "./pages/Redirect";
import Checkout from "./pages/Checkout";
import Registration from "./pages/Registration";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Header from "./components/containers/Header";
import store from './state/store';



const routes = [
  { path: "/product-search", Component: ProductSearch },
  { path: "/search/:type/:query", Component: ProductSearch },
  { path: "/payment", Component: Payment},
  { path: "/basket", Component: Basket },
  { path: "/login", Component: Login },
  { path: "/redirect", Component: Redirect },
  { path: "/checkout", Component: Checkout},
  { path: "/registration", Component: Registration},
  { path: "/account", Component: Account},
  { path: "/", Component: Home }  
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
