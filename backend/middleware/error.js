const ErrorHandler = require('../utils/errorhandler');
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";


    //Wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resouce not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 404); 
    }


    // Mongoose Duplicate key error

    if(err.code===11000)
    {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 404);
    }
    
    // Wrong jason web token

    if(err.name ==="JsonWebTokenError")
    {
        const message = `Json Web Token is Invalid, try again`
        err = new ErrorHandler(message, 404);
    }


    // jason web token expire

    if(err.name ==="TokenExpiredError")
    {
        const message = `Json Web Token is Expired, try again`
        err = new ErrorHandler(message, 404);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}