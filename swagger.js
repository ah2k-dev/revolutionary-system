const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Revolutionary System",
    description: "Revolutionary System api endpoints",
    version: "1.0.0",
  },
  host: "localhost:8001",
  // host: "64.226.125.111",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [],
};

const outputFile = "./swagger_output.json"; // Generated Swagger file
const endpointsFiles = ["./src/router/index.js"]; // Path to the API routes files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger file generated");
});
