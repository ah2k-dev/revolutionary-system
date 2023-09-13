
import express, { Request, Response,NextFunction } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
const ApiError = require("./utils/ApiError");
const app = express();
const router = require("./router");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger_output.json"); // Generated Swagger file

// Middlewares
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);

// router index
app.use("/", router);
// api doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req:Request, res:Response):void => {
  res.send("BE-logistic v1.1");
});

// send back a 404 error for any unknown api request
app.use((req:Request, res:Response, next:NextFunction) => {
  next(new ApiError(404, "Not found"));
});

export default app;
