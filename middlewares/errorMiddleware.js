const ApiError = require("../utils/apiError")

const sendErrorForDevMode = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        err:err,
        message:err.message,
        stack:err.stack
    })
}

const sendErrorForProdMode = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })
}


const handleJwtInvalidSignature =()=>new ApiError("Invalid Token, Please login again..",401)
const handleJwtExpiredToken =()=>new ApiError("Expired Token, Please login again..",401)

const globalError =(err,req,res,next)=>{
    err.statusCode =err.statusCode ||500;
    err.status = err.status ||"error"
    if(process.env.NODE_ENV==='development'){
        sendErrorForDevMode(err,res);
    }else{
        if(err.name ==='JsonWebTokenError') err= handleJwtInvalidSignature();
        if(err.name ==='TokenExpiredError') err= handleJwtExpiredToken();
        sendErrorForProdMode(err,res);
    }

}

module.exports =globalError;