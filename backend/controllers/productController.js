const Product = require('./../models/productModel');
const ErrorHandler = require("./../utils/errorhandler");
const catchAsyncErrors = require("./../middleware/catchAsyncErrors");
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require("cloudinary")

//Create Product -- Admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images =[];
    if(typeof req.body.images==="string")
    {
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder : "products"

        })

        imagesLinks.push({
            public_id : result.public_id,
            url : result.secure_url
        })
        
    }

    req.body.images = imagesLinks;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    
    res.status(201).json({
        success: true,
        product
    })

}
)
//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res,next) => {

    // return next(new ErrorHandler("This is my temp error",500));


    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    console.log(productsCount);

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
    // const products=await Product.find();
    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });

});




//Get All Products -- Admin

exports.getAdminProducts = catchAsyncErrors(async (req, res,next) => {

    // return next(new ErrorHandler("This is my temp error",500));

    const products = await Product.find();
    
    res.status(200).json({
        success: true,
        products,
    });

});

//Update Product -- Admin 
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(5000).json({
            success: false,
            message: "Product not found"
        })
    }

    //Images start here
    let images =[];
    if(typeof req.body.images==="string")
    {
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }

    if(images!==undefined)
    {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            
        }

        const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder : "products"

        })

        imagesLinks.push({
            public_id : result.public_id,
            url : result.secure_url
        })
        
    }
    req.body.images = imagesLinks;
    
    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
});

//Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (product === null) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product,
    })

});


//Delete Product -- ADMIN

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(5000).json({  
            success: false,
            message: "Product not found"
        })
    }

    //Deleting Images from Cloudinary

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await Product.findByIdAndRemove(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
});


// Create new REview or Update the Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {


    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev =>  rev.user.toString() === req.user._id.toString() )
    if (isReviewed) {

        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
            {
                (rev.rating = rating),
                (rev.comment = comment);
            }
        })
    }
    else {
        product.reviews.push(review);

        product.numOfReviews=product.reviews.length;

    }
    let avg=0;
    product.reviews.forEach((rev)=>{
        avg+=rev.rating;

    })

    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave : false
    });

    res.status(200).json({
        success : true,

    })

})

//Get All reviews of a product

exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }


    res.status(200).json({
        success:true,
        reviews : product.reviews,
    })
})


// Delete Reviews
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())

    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating;

    })

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;


    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true,
      });

})

