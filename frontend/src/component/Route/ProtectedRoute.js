import React from 'react';
import { useSelector } from 'react-redux';
import {Navigate} from "react-router-dom";


const ProtectedRoute = (props) => {

    const {loading,isAuthenticated,user} = useSelector((state)=>state.user);
  return (
    <>
       
       <div>
        {loading === false && (()=>{
          if(isAuthenticated === false){
            <Navigate to="/login"/>
          }

          if(props.isAdmin === true && user.role !== "admin"){
            return <Navigate to="/login"/>
          }

          return props.element
        })()}
        </div>
    </>
  )
}

export default ProtectedRoute
