// import { Request, Response } from "express";
// import Profile from "../models/User/profile";
// import User from "../models/User/user";
// import { ProfileDocument } from "../types/models/User/profile.types";
// import { UserDocument } from "../types/models/User/user.types";
// import SuccessHandler from "../utils/SuccessHandler";
// import ErrorHandler from "../utils/ErrorHandler";
// import axios from "axios";
// import dotenv from "dotenv";
// // import queryString from "query-string";
// // const queryString = "query-string");

// // const queryString = require("query-string");
// // const queryString = await import("query-string");

// // Now you can use queryString as needed

// dotenv.config({ path: ".././src/config/config.env" });
// import {
//   shopifyApi,
//   LATEST_API_VERSION,
//   ApiVersion,
//   ConfigParams,
// } from "@shopify/shopify-api";
// // import { default as nodeFetch } from "node-fetch"; // Import Node.js fetch implementation
// import "@shopify/shopify-api/adapters/node";
// // Set the fetch implementation for Shopify API
// // shopifyApi.fetch = nodeFetch;
// import queryString from "query-string";
// declare global {
//   namespace Express {
//     interface Request {
//       profile?: ProfileDocument;
//     }
//   }
// }
// import * as qs from "qs";
// interface ShopifyConfig extends ConfigParams {
//   apiKey: string;
//   apiSecretKey: string;
//   scopes: string[];
//   hostName: string;
//   redirectUri: string;
//   apiVersion: ApiVersion;
//   isEmbeddedApp: boolean;
// }

// const shopifyConfig: ShopifyConfig = {
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
//   scopes: ["read_products,write_products"],
//   hostName: "ngrok-tunnel-address",
//   redirectUri: "https://chat.openai.com/c/ed950cde-2a09-48a7-a7d5-9a00f13c2cb1",
//   apiVersion: ApiVersion.July22,
//   isEmbeddedApp: false,
// };

// const shopify = shopifyApi(shopifyConfig);
// // Store access tokens associated with Shopify store URLs
// const accessTokens = new Map();

// const redirectToUrl = async (req: Request, res: Response) => {
//   // #swagger.tags = ['shopify']
//   try {
//     // const shopUrl = req.query.shop;
//     const shopUrl = "e092e8";
//     const authUrl = `https://${shopUrl}.myshopify.com/admin/oauth/authorize?client_id=${shopifyConfig.apiKey}&scope=${shopifyConfig.scopes}&redirect_uri=${shopifyConfig.redirectUri}`;
//     // res.redirect(authUrl);

//     return SuccessHandler(
//       { message: "Redirected to shopify store", authUrl },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };
// // Step 2: Handle OAuth callback and retrieve access token
// const retrieveAccessToken = async (req: Request, res: Response) => {
//   // #swagger.tags = ['shopify']
//   try {
//     // const { code, shop } = req.query;
//     const { code } = req.query;
//     const shop = "e092e8";
//     const token = await axios.post(
//       `https://${shop}.myshopify.com/admin/oauth/access_token`,
//       qs.stringify({
//         client_id: shopifyConfig.apiKey,
//         client_secret: shopifyConfig.apiSecretKey,
//         code,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     const accessToken = token.data.access_token;
//     accessTokens.set(shop, accessToken);

//     return SuccessHandler(
//       {
//         message: "Redirected to shopify store",
//         // result: `ccess token obtained for store: ${shop} and AccessToken:`,
//         result: `ccess token obtained for store: ${shop} and AccessToken: ${accessToken}`,
//       },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };
// export { redirectToUrl, retrieveAccessToken };
