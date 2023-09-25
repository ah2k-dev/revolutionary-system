const OneSignal = require("onesignal-node");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const oneSignalClient = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID,
  process.env.REST_API_KEY
);

const sendNotification = async (headingContent, contentMessage, userId, id) => {
  try {
    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: headingContent },
      contents: {
        en: contentMessage,
      },
      // included_segments: ["All"],
      include_external_user_ids: [userId],
      large_icon:
        "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=626&ext=jpg",
      // big_picture:
      //   "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1865596468.1692806850&semt=ais",
      data: {
        id: id,
      },
    };
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${process.env.REST_API_KEY}`,
    };
    // create a notification
    const response = await oneSignalClient.createNotification(
      notification,
      headers
    );
    SuccessHandler(
      { message: "Notification Send Successfuly", response },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = { sendNotification };
