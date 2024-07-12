const path =require('path')

const express =require("express");
const dotenv =require("dotenv");
const morgan =require("morgan");


dotenv.config({path:'config.env'})

// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression')


const dbConnection =require('./config/database');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');

const mountRoutes = require('./routes/index')

const PORT =process.env.PORT||8300;


dbConnection();
// Express App
const app =express();
//Enable other domains to access your application 
app.use(cors())
app.options('*', cors())
// Compress all responses
app.use(compression())


//Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname,'uploads')))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"))
    console.log(`mode : ${process.env.NODE_ENV}`)
}

// Mount Routes
mountRoutes(app);

app.all("*",(req,res,next) =>{
//create error and send it to error handling middleware
    // const error =new Error(`Can't find this route ${req.originalUrl}`)
    // next(error.message);
    // next(new ApiError(message,statusCode))
    next(new ApiError(`Can't find this route ${req.originalUrl}`,400))
})
//global error handling middleware for express
app.use(globalError)

const server = app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`)
})
// handling errors from out side express (handle rejections outside express)
process.on('unhandledRejection',(error)=>{
    console.log(`UnHandledRejection Errors : ${error.name} | ${error.message}`)
    server.close(()=>{
        console.error('shutting down......')
        process.exit(1);
    })
})