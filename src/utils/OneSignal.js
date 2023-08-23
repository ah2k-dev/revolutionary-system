const OneSignal = require('@onesignal/node-onesignal');

// const configuration = OneSignal.createConfiguration({
//     authMethods: {
//         app_key: {
//         	tokenProvider: app_key_provider
//         }
//     }
// });
// const client = new OneSignal.DefaultApi(configuration);

// const configuration = OneSignal.createConfiguration({
//     userKey: '<YOUR_USER_KEY_TOKEN>',
//     appKey: '<YOUR_APP_KEY_TOKEN>',
// });

const client = new OneSignal.DefaultApi(configuration);
const response = await client.createApp(newapp);

const configuration = OneSignal.createConfiguration({
    userKey: '<YOUR_USER_KEY_TOKEN>',
    appKey: response.basic_auth_key,
});


const notification = new OneSignal.Notification();
notification.app_id = ONESIGNAL_APP_ID;
// notification.included_segments = ['Subscribed Users'];
notification.contents = {
	en: "Hello OneSignal!"
};
const {id} = await client.createNotification(notification);


// const app_key_provider = {
//     getToken() {
//         return 'ONESIGNAL_REST_API_KEY';
//     }
// };