const OneSignal = require("onesignal-node");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const oneSignalClient = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID,
  process.env.REST_API_KEY
);
console.log("id:", process.env.ONESIGNAL_APP_ID);

const sendNotification = async (req, res) => {
  // #swagger.tags = ['notification']

  try {
    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: "Welcome to Revolutionary App" },
      contents: {
        en: "We are sending sample notification",
      },
      // included_segments: ["All"],
      // include_external_user_ids: ["64e663d2cd6392181ac991ba"],
      large_icon:
        "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=626&ext=jpg",
      big_picture:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1865596468.1692806850&semt=ais",
      //    data: {
      //      postId
      //      },
    };
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      // "Content-Type": "application/json",
      Authorization: `Basic ${process.env.REST_API_KEY}`, // Replace with your OneSignal REST API Key
    };
    // create a notification
    const response = await oneSignalClient.createNotification(
      notification,
      headers
    );
    console.log("response: ", response);
    console.log(response.body.id);

    SuccessHandler(
      { message: "Notification Send Successfuly", response },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

const viewNotification = async (req, res) => {
  // #swagger.tags = ['notification']
  try {
    const notificationId = req.params.notificationId;
    const response = await client.getNotification(
      process.env.ONESIGNAL_APP_ID,
      notificationId
    );
    SuccessHandler(
      { message: "Notification retrieved successfully", response },
      200,
      res
    );
  } catch (error) {
    ErrorHandler("Failed to send notification", 500, req, res);
  }
};

module.exports = { sendNotification, viewNotification };
