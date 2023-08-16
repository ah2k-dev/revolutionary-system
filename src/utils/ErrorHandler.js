const logger = require("../functions/logger");
const ErrorHandler = (message, statusCode, req, res) => {
  logger.error({
    method: req.method,
    url: req.url,
    date: new Date(),
    message: message,
  });
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};


// const catchAsyncError = (handler) => (req, res)=>{
//   Promise.resolve(handler(req, res)).catch((error)=>{
//       return ErrorHandler(req, res)
//   })}


module.exports = ErrorHandler;
