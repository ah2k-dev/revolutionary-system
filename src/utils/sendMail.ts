import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/config.env" });
// import sendgridTransport from "nodemailer-sendgrid-transport";
const sendgridTransport = require("nodemailer-sendgrid-transport")
const { createTransport } = nodemailer;

const sendMail = async (email:string, subject:string, text:string) => {
  const transport = createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.NODEMAILER_API_KEY,
      },
    })
  );
  await transport.sendMail({
    from: "insightmeter@gmail.com",
    to: email,
    subject,
    text,
  });
};

export default sendMail;
