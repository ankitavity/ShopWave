import React, { Fragment, useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector } from "react-redux"
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
// import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.js";
import Loader from "./../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from '../layout/MetaData';
import { addItemsToCart } from "./../../actions/cartAction.js"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core"
import { Rating } from '@material-ui/lab';
import { NEW_REVIEW_RESET } from '../../actions/constants/productConstants';




const ProductDetails = () => {


    const { id } = useParams();
    const dispatch = useDispatch();

    const alert = useAlert();

    const { product, loading, error } = useSelector((state) => state.productDetails)
    const { success, error: reviewError } = useSelector((state) => state.newReview)

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");


    // console.log(quantity);
    const increaseQuantity = () => {
        let qty = quantity + 1;
        if (qty > product.Stock) {
            qty = qty - 1;
            alert.error(`Only ${product.Stock} available in Stock`);
            dispatch(clearErrors());
        }
        setQuantity(qty);

    }

    const decreaseQuantity = () => {
        let qty = quantity - 1;
        if (qty < 1) {
            qty = 1;
        }
        setQuantity(qty);
    }


    const addToCartHandler = () => {

        dispatch(addItemsToCart(id, quantity));
        alert.success("Item added to Cart")
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }
    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));

        setOpen(false);

    }

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET })
        }
        dispatch(getProductDetails(id))

    }, [dispatch, id, alert, error, reviewError, success])

    const options = {
        value: product.ratings,
        readOnly : true,
        precision : 0.5
    }


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`${product.name}  -- ShopWave`} />
                    <div className='ProductDetails'>
                        {/* <div> */}
                        <Carousel>
                            {
                                product.images && product.images.map((item, i) => (
                                    <img
                                        className='CarouselImage'
                                        key={i}
                                        src={item.url}
                                        alt={`${i} Slide `} />
                                ))
                            }
                        </Carousel>
                        {/* </div> */}
                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product #{product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className='detailsBlock-2-span'>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button disabled={product.Stock < 1 ? true : false} onClick={addToCartHandler}>Add To Cart</button>
                                </div>
                                <p>
                                    Status :
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Description : <p>{product.description}</p>
                            </div>

                            <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                        </div>
                    </div>
                    <h3 className="reviewsHeading">REVIEWS</h3>

                    <Dialog aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea className='submitDialogTextArea' cols="30" rows="5" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color='secondary'>cancel</Button>
                            <Button onClick={reviewSubmitHandler} color='primary'>submit</Button>
                        </DialogActions>
                    </Dialog>

                    {
                        product.reviews && product.reviews[0] ? (
                            <div className="reviews">
                                {product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}
                            </div>
                        ) : (
                            <p className="noReviews">No Reviews Yet</p>
                        )
                    }
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProductDetails
