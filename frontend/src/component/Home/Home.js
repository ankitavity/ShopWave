import React, { Fragment, useEffect } from 'react'
// import { AiOutlineShoppingCart } from "react-icons/AiOutlineShoppingCart";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import "./Home.css"

import { clearErrors, getProduct } from "../../actions/productAction";

import { useSelector, useDispatch } from "react-redux"

import MetaData from '../layout/MetaData';

import ProductCard from "./ProductCard.js"

import Loader from "./../layout/Loader/Loader";
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';




const Home = () => {
  const alert = useAlert();

  const dispatch = useDispatch();

  const { loading, error, products } = useSelector(state => state.products)

  const navigate = useNavigate();
  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    // dispatch(getProduct());

  }, [dispatch, error, alert])

  function productNavigate(){
    navigate('/products');
  }

  return (
    <Fragment>

      {loading ? <Loader /> : (
        <Fragment>
          <MetaData title="ShopWave" />

          <div className="banner">
            <p>Welcome to ShopWave</p>
            <h1>FIND AMAZING PRODUCTS HERE</h1>

            <a href="#container">
              <button onClick={productNavigate}>
                Products <ShoppingCartCheckoutIcon/>
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Happy Browsing ✌️</h2>

          {/* <div className="container" id="container">
            {products && products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div> */}
        </Fragment>
      )}
    </Fragment>
  )
}

export default Home;