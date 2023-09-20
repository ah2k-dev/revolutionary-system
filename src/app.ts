import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger_output.json";
import ApiError from "./utils/ApiError";
import loggerMiddleware from "./middleware/loggerMiddleware";
import fileUpload from "express-fileupload";

import path from "path";
const app: Express = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);
import slugify from "slugify";
const title =
  "SAMSUNG Galaxy Buds 2 Pro True Wireless Bluetooth Earbuds w/ Noise Cancelling, Hi-Fi Sound, 360 Audio, Comfort Ear Fit, HD Voice, Conversation Mode, IPX7 Water Resistant, US Version, Graphite";

const slug = slugify(title, {
  replacement: "-",
  lower: true,
  strict: false,
  trim: true,
  remove: /[^a-zA-Z0-9\s]/g,
});
console.log(slug);

// will be in near future
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 },
  })
), // 1 MB
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// router index
app.use("/", router);
// api doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req: Request, res: Response) => {
  res.send("BE-logistic v1.1");
});

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "Not found"));
});

export default app;
