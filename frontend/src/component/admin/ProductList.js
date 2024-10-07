import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, deleteProduct } from '../../actions/productAction';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../actions/constants/productConstants';
// import { Navigate } from 'react-router-dom';

const ProductList = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, products } = useSelector((state) => state.products);
  const navigate = useNavigate();  

  const {error : deleteError,isDeleted} = useSelector((state)=>state.product) 


  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 200,
      flex: 0.5
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 300,
      flex: 0.7
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 150,
      flex: 0.3,
      type: "number"
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 270,
      flex: 0.5,
      type: "number"
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
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={()=>deleteProductHandler(params.getValue(params.id,"id"))}>
              <DeleteIcon />

            </Button>
          </>
        )
      }
    }
  ]


  
  const deleteProductHandler = (id)=>{
    dispatch(deleteProduct(id))
}



  const rows = [];

  
    products && products.forEach(item => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name
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
      alert.success("Product Deleted Successfully");
      navigate("/admin/dashboard");
      dispatch({
        type : DELETE_PRODUCT_RESET
      })
    }
  
  }, [dispatch,alert,error,deleteError,navigate,isDeleted])
  

  return (
    <>
      <MetaData title={`ALL PRODUCTS - ADMIN`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">
            All Products
          </h1>

          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight />

        </div>
      </div>
    </>
  )
}

export default ProductList
