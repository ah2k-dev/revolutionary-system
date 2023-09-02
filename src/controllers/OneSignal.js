// const OneSignal = require('@onesignal/node-onesignal');
const OneSignal = require("onesignal-node");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const sendNotification = async (req, res) => {
  const client = new OneSignal.Client(
    process.env.ONE_SIGNAL_APP_ID,
    process.env.ONE_SIGNAL_API_KEY
  );

  const notification = {
    headings: { en: "Welcome to Revolutionary App" },
    contents: {
      en: "We are sending sample notification",
    },
    included_segments: ["Subscribed Users"],
    large_icon:
      "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=626&ext=jpg",
    big_picture:
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1865596468.1692806850&semt=ais",
    //    data: {
    //      postId
    //      },
  };
  try {
    // const res =
    await client.createNotification(notification);
    SuccessHandler("Notification Send Successfuly", 200, res);
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = { sendNotification };
