const ErrorHandler = require("../utils/ErrorHandler");

const authorizedUser = (req, res, next) => {
  // if not of 'host'
  if (req.user.role !== "user") {
    return ErrorHandler(
      `Role: ${req.user.role} is not allowed to access resource`,
      400,
      req,
      res
    );
  }

  next();
};

const authorizedHost = (req, res, next) => {
  // if not of 'host'
  if (req.user.role !== "host") {
    return ErrorHandler(
      `Role: ${req.user.role} is not allowed to access resource`,
      400,
      req,
      res
    );
  }

  next();
};

const authorizedCook = (req, res, next) => {
  // if not of 'cook'
  if (req.user.role !== "cook") {
    return ErrorHandler(
      `Role: ${req.user.role} is not allowed to access resource`,
      400,
      req,
      res
    );
  }

  next();
};

module.exports = { authorizedCook, authorizedHost, authorizedUser };
