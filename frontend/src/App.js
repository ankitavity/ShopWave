import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js";
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from 'axios';
import Payment from "./component/Cart/Payment.js";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/admin/Dashboard.js";
import ProductList from "./component/admin/ProductList.js"
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from './component/admin/UpdateProduct';
import OrderList from './component/admin/OrderList.js';
import ProcessOrder from "./component/admin/ProcessOrder.js"
import UsersList from './component/admin/UsersList';
import UpdateUser from './component/admin/UpdateUser';
import ProductReviews from './component/admin/ProductReviews';
// import NotFound from './component/layout/Not Found/NotFound';
import AboutPage from "./component/Contact/AboutPage.js";
import ContactPage from "./component/Contact/ContactPage.js";




const App = () => {

  const { isAuthenticated, user } = useSelector(state => state.user);


  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    try{
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
    }
    catch(error)
    {
      console.log(error)
    }

  }
  

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })

    store.dispatch(loadUser());
    getStripeApiKey();

  }, [])


  // window.addEventListener("contextmenu",(e)=>e.preventDefault());


  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/product/:id" Component={ProductDetails} />
        <Route exact path="/about" Component={AboutPage} />
        <Route exact path="/contact" Component={ContactPage} />
        <Route exact path="/products" Component={Products} />
        <Route path="/products/:keyword" Component={Products} />
        <Route exact path="/search" Component={Search} />
        <Route exact path="/account" element={<ProtectedRoute element={<Profile />} />} />
        <Route exact path="/me/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
        <Route exact path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
        <Route exact path="/password/forgot" Component={ForgotPassword} />
        <Route exact path="/password/reset/:token" Component={ResetPassword} />
        <Route exact path="/login" Component={LoginSignUp} />
        <Route exact path="/cart" Component={Cart} />
        <Route exact path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
        <Route exact path="/order/confirm" element={<ProtectedRoute element={<ConfirmOrder />} />} />
        <Route exact path="/success" element={<ProtectedRoute element={<OrderSuccess />} />} />
        <Route exact path="/orders" element={<ProtectedRoute element={<MyOrders />} />} />

        <Route exact path="/order/:id" element={<ProtectedRoute  element={<OrderDetails />} />} />
        <Route exact path="/admin/dashboard" element={<ProtectedRoute isAdmin={true} element={<Dashboard/>} />} />


        <Route exact path="/admin/products" element={<ProtectedRoute isAdmin={true} element={<ProductList/>} />} />


        <Route exact path="/admin/product" element={<ProtectedRoute isAdmin={true} element={<NewProduct/>} />} />


        <Route exact path="/admin/product/:id" element={<ProtectedRoute isAdmin={true} element={<UpdateProduct/>} />} />


        <Route exact path="/admin/orders" element={<ProtectedRoute isAdmin={true} element={<OrderList/>} />} />


        <Route exact path="/admin/order/:id" element={<ProtectedRoute isAdmin={true} element={<ProcessOrder/>} />} />


        <Route exact path="/admin/users" element={<ProtectedRoute isAdmin={true} element={<UsersList/>} />} />


        <Route exact path="/admin/user/:id" element={<ProtectedRoute isAdmin={true} element={<UpdateUser/>} />} />


        <Route exact path="/admin/reviews" element={<ProtectedRoute isAdmin={true} element={<ProductReviews/>} />} />
        {/* <Route path="*" element={<NotFound />} /> */}
        {/* <Elements stripe={loadStripe(stripeApiKey)}>

        <Route exact path="/process/payment" element={<ProtectedRoute element={<Payment />} />} />
        </Elements> */}

        {stripeApiKey && (
          <Route
            exact path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute element={<Payment />} />
              </Elements>
            }
          />
        )}


      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
