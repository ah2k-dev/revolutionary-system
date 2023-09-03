// const OneSignal = require('@onesignal/node-onesignal');
const OneSignal = require("onesignal-node");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const oneSignalClient = new OneSignal.Client(
  process.env.ONE_SIGNAL_APP_ID,
  process.env.ONE_SIGNAL_API_KEY
);

const sendNotification = async (req, res) => {
  const notification = {
    headings: { en: "Welcome to Revolutionary App" },
    contents: {
      en: "We are sending sample notification",
    },
    // included_segments: ["Subscribed Users"],
    include_player_ids: ["64e66ss3d2-cd63-9218-1ac9-91ba"],
    large_icon:
      "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=626&ext=jpg",
    big_picture:
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1865596468.1692806850&semt=ais",
    //    data: {
    //      postId
    //      },
  };
  try {
    // create a notification
    const response = await oneSignalClient.createNotification(notification);
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

module.exports = { sendNotification };
