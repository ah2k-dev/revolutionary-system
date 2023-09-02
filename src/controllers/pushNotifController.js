const OneSignal = require("@onesignal/node-onesignal");
// const OneSignal = require("onesignal-node");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const configuration = OneSignal.createConfiguration({
  authMethods: {
    app_key: {
      tokenProvider: process.env.REST_API_KEY,
    },
  },
});
const client = new OneSignal.DefaultApi(configuration);

const sendNotification = async (req, res) => {
  // #swagger.tags = ['notif']
  try {
    const notification = new OneSignal.Notification();

    notification.app_id = process.env.ONESIGNAL_APP_ID;
    notification.included_segments = ["Subscribed Users"];
    notification.contents = {
      en: "Hello OneSignal!",
    };
    const { id } = await client.createNotification(notification);
    const response = await client.getNotification(ONESIGNAL_APP_ID, id);
    SuccessHandler(
      { message: "Notification sent successfully", response, id },
      200,
      res
    );
  } catch (error) {
    ErrorHandler("Failed to send notification", 500, req, res);
  }
};

const getNotification = async (req, res) => {
  // #swagger.tags = ['notif']
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

module.exports = {
  sendNotification,
  getNotification,
};
