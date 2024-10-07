import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.jpg";
import "./Footer.css";


const Footer = () => {
  return (
    <footer id="footer">
    <div className="leftFooter">
      <h4>DOWNLOAD OUR APP</h4>
      <p>Download App for Android and IOS mobile phone</p>
      <img src={playStore} alt="playstore" />
      <img src={appStore} alt="Appstore" />
    </div>

    <div className="midFooter">
      <h1>ShopWave.</h1>
      <p>High Quality is our first priority</p>

      <p>Copyrights 2021 &copy; Subham Chandra</p>
    </div>

    <div className="rightFooter">
      <h4>Follow Us</h4>
      <a href="https://www.linkedin.com/in/subhamchandra528/">LinkedIn</a>
      <a href="https://twitter.com/SubhamC60715111">Twitter</a>
      <a href="https://www.facebook.com/subham.chandra.750/">Facebook</a>
    </div>
  </footer>
  )
}

export default Footer
