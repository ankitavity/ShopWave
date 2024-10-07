const app= require('./app');

const dotenv = require('dotenv')
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database')
//Config

// if(process.env.NODE_ENV!=="PRODUCTION"){

    dotenv.config({path: "./config/.env"});
// }


//Connecting to Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

//Handling uncaughtException
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to  uncaughtException`);
    server.close(()=>{
        process.exit(1); 
    });
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`);
})


//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server`);

    server.close(()=>{
        process.exit(1);
    });
})