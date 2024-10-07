import React, { useEffect, useState } from 'react'
import "./newProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, updateProduct, getProductDetails } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Sidebar from './Sidebar';
import { UPDATE_PRODUCT_RESET } from '../../actions/constants/productConstants';
import { useNavigate, useParams } from 'react-router-dom';




const UpdateProduct = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.product);
    const { id } = useParams();
    const productId = id;
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldimages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const navigate = useNavigate();

    const { error, product } = useSelector((state) => state.productDetails);

    const categories = ["Laptop", "Toys", "Education", "Bottom", "Tshirt", "Camera", "Smartphones"];

    useEffect(() => {

        if (product && product._id !== productId) {
            dispatch(getProductDetails(productId))
        }
        else {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.Stock);
            setOldImages(product.images);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());

        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Product Updated Successfullly");
            navigate("/admin/products");
            dispatch({
                type: UPDATE_PRODUCT_RESET
            })
        }


    }, [dispatch, alert, error, navigate, isUpdated, productId, product, updateError])


    const updateProductSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("Stock", Stock);


        images.forEach((image) => {
            myForm.append("images", image)
        })

        dispatch(updateProduct(productId, myForm))
    }



    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file)
        })
    }


    return (
        <>
            <MetaData title="Create Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form action="" className='createProductForm' encType='multipart/form-data' onSubmit={updateProductSubmitHandler}>
                        <h1>Create Product</h1>
                        <div>
                            <SpellcheckIcon />
                            <input type="text" placeholder='Product Name' required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <AttachMoneyIcon />
                            <input type="text" value={price} placeholder='Price' required onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <DescriptionIcon />
                            <textarea placeholder='Product Desription' value={description} rows="1" cols="30" onChange={(e) => setDescription(e.target.value)} >

                            </textarea>
                        </div>

                        <div>
                            <AccountTreeIcon />
                            {/* <textarea  placeholder='Product Desription' value={description} rows="1" cols="30" onChange={(e)=>setDescription(e.target.value)} > */}

                            {/* </textarea> */}

                            <select value={category} onChange={(e) => setCategory(e.target.value)} id="">
                                <option value="">
                                    Choose Category
                                </option>
                                {categories.map((cate) => {
                                    return (
                                        <option key={cate} value={cate}>{cate}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div>
                            <StorageIcon />
                            <input type="number" value={Stock} placeholder='Stock' required onChange={(e) => setStock(e.target.value)} />
                        </div>


                        <div id='createProductFormFile'>
                            {/* <StorageIcon /> */}
                            <input type="file" name='Avatar' accept='image/*' multiple onChange={updateProductImagesChange} />
                        </div>
                        <div id='createProductFormImage'>

                            { oldimages && oldimages.map((image, index) => (
                                <img key={index} src={image.url} alt="Old Product Preview" />
                            ))}
                        </div>

                        <div id='createProductFormImage'>

                            {imagesPreview.map((image, index) => (
                                <img key={index} src={image} alt="Product Preview" />
                            ))}
                        </div>

                        <Button id="createProductBtn" type='submit' disabled={loading ? true : false}>
                            Create Product
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct
