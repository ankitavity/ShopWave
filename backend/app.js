const express = require('express');
const cookieParser = require('cookie-parser');
const app=express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
// const path = require("path")

const errorMiddleware = require("./middleware/error");
dotenv.config({path: "./config/.env"});

app.use(express.json({limit: '80mb'}));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser());
app.use(fileUpload());

//Routes import

const product = require("./routes/productRoute");

const user = require('./routes/userRoute');

app.get("/",(req,res)=>{
    res.send("<h2>Hello World</h2>");
})


const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

// Middleware for error
// app.use(express.static(this.path));
app.use(errorMiddleware);

app.use("/api/v1",product);
//for user registration

app.use("/api/v1",user);
app.use("/api/v1",payment);

app.use("/api/v1",order);
module.exports = app;