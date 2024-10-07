import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors,} from '../../actions/productAction';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from './Sidebar';
// import { DELETE_PRODUCT_RESET } from '../../actions/constants/productConstants';

import { deleteUser, getAllUsers } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../actions/constants/userConstants';
// import { Navigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

const UsersList = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, users} = useSelector((state) => state.allUsers);
  const navigate = useNavigate(); 


  const { error : deleteError,isDeleted,message} = useSelector((state)=>state.profile)



  const columns = [
    {
      field: "id",
      headerName: "User Id",
      minWidth: 180,
      flex: 0.5
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 180,
      flex: 0.7
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 0.5,
      cellClassName : (params) =>{
        return params.getValue(params.id,"role") === "admin" ? "greenColor" : "redColor" ;
    }
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
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={()=>deleteUserHandler(params.getValue(params.id,"id"))}>
              <DeleteIcon />

            </Button>
          </>
        )
      }
    }
  ]


  
  const deleteUserHandler = (id)=>{
    dispatch(deleteUser(id))
}



  const rows = [];

  users && users.forEach(item => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
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
      alert.success(message);
      navigate("/admin/users");
      dispatch({
        type : DELETE_USER_RESET  
      })
    }

    dispatch(getAllUsers())
  
  }, [dispatch,alert,message,error,deleteError,navigate,isDeleted])
  

  return (
    <>
      <MetaData title={`ALL USERS - ADMIN`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">
            ALL USERS
          </h1>

          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight />

        </div>
      </div>
    </>
  )
}


export default UsersList;
