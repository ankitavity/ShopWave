import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from '../../actions/productAction';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from './Sidebar';
import { deleteOrder, getAllOrders } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../actions/constants/orderConstants';
// import { Navigate } from 'react-router-dom';

const OrderList = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, orders } = useSelector((state) => state.allOrders);
  const navigate = useNavigate();  

  const {error : deleteError, isDeleted} = useSelector((state)=>state.order) 


  const columns = [
    {field : "id",headerName : "Order ID",minWidth : 250,flex:0.7},
    {
        field : "status",
        headerName : "Status",
        minWidth : 150,
        flex : 0.5,
        cellClassName : (params) =>{
            return params.getValue(params.id,"status") === "Delivered" ? "greenColor" : "redColor" ;
        }
    },
    {
        field : "itemsQty",
        headerName : "Items Qty",
        type : "number",
        minWidth : 150,
        flex : 0.3,

    },
    {
        field : "amount",
        headerName : "Amount",
        type : "number",
        minWidth : 270,
        flex : 0.5
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={()=>deleteOrderHandler(params.getValue(params.id,"id"))}>
              <DeleteIcon />

            </Button>
          </>
        )
      }
    }
  ]


  
  const deleteOrderHandler = (id)=>{
    dispatch(deleteOrder(id))
}



  const rows = [];

  
    orders && orders.forEach(item => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length ,
        amount: item.totalPrice,
        status: item.orderStatus
      })
    });
  


  useEffect(() => {
    if(error)
    {
      alert.error(error);
      dispatch(clearErrors());
    }
    if(deleteError)
    {
      alert.error(error);
      dispatch(clearErrors());

    }
    if(isDeleted)
    {
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({
        type : DELETE_ORDER_RESET
      })
    }

    dispatch(getAllOrders())
  
  }, [dispatch,alert,error,deleteError,navigate,isDeleted])
  

  return (
    <>
      <MetaData title={`ALL ORDERS - ADMIN`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">
            ALL ORDERS
          </h1>

          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight />

        </div>
      </div>
    </>
  )
}

export default OrderList
