import React,{useState} from 'react';
import "./Shipping.css";
import { useSelector,useDispatch } from 'react-redux';
import {saveShippingInfo} from "./../../actions/cartAction";
import MetaData from '../layout/MetaData';
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import {Country,State} from "country-state-city";
import { useAlert } from 'react-alert';
import CheckoutSteps from "./../Cart/CheckoutSteps.js";
import "./CheckoutSteps.css";
import {useNavigate} from "react-router-dom"


const Shipping = () => {

  const dispatch = useDispatch();
  const alert =useAlert();
  const {shippingInfo} = useSelector((state)=>state.cart)
  const navigate = useNavigate();


  const [address,setAddress] = useState(shippingInfo.address)
  const [city,setCity] = useState(shippingInfo.city);
  const [state,setState] = useState(shippingInfo.state);
  const [country,setCountry] = useState(shippingInfo.country);
  const [pinCode,setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo,setPhoneNo] = useState(shippingInfo.phoneNo);

      const shippingSubmit = (e)=>{
        e.preventDefault();
        if(phoneNo.length>10 || phoneNo.length<10)
        {
          alert.error("Phone Number should be of 10 digits")
          return;
        }
        dispatch(
          saveShippingInfo({
            address,city,state,country,pinCode,phoneNo
          })
        )
        navigate("/order/confirm");
      }

  return (
    <>
        <MetaData title="Shipping Details" />
        <CheckoutSteps activeSteps={0} />
        <div className="shippingContainer">
          <div className="shippingBox">
            <h2 className="shippingHeading">
              Shipping Details
            </h2>

            <form className='shippingForm' encType='multipart/form-data' onSubmit={shippingSubmit}>
              <div>
              <HomeIcon />
              <input type="text" placeholder='Address' required value={address} onChange={(e)=>{setAddress(e.target.value)}} />

              </div>
              <div>
                <LocationCityIcon />
                <input type="text"
                placeholder='City'
                required 
                  value={city}
                  onChange={(e)=>setCity(e.target.value)}
                />
              </div>
              <div>
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
              <div>
                <PhoneIcon />
                <input type="number" placeholder='Enter phone number' required value={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} size="10" />
              </div>
              <div>
                <PublicIcon />
                <select required value={country} onChange={(e)=>setCountry(e.target.value)}>
                  <option value="">Country</option>
                  {Country && Country.getAllCountries().map((country)=>(
                    <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                  ))}
                </select>
              </div>

              {country && (
                <div>
                  <TransferWithinAStationIcon />
                  <select required value={state} onChange={(e)=>setState(e.target.value)}>
                    <option value="">State</option>
                     {State && State.getStatesOfCountry(country).map((state)=>(
                      <option value={state.isoCode} key={state.isoCode}>{state.name}</option>
                     ))}
                  </select>
                </div>
              )}

              <input type="submit" value="Continue" className='shippingBtn' disabled={state?false:true} />

            </form>
             
          </div>
        </div>
    </>
  )
}

export default Shipping
