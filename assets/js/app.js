/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
require("../css/app.css");

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

AuthAPI.setUp();


const App = () => {
  // State permettant de savoir si l'utilisateur est actuellement identifié avec false par défaut
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavBarWithRouter = withRouter(Navbar);

  const contextValue = {
    isAuthenticated: isAuthenticated,
    setIsAuthenticated: setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <HashRouter>
        <NavBarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
