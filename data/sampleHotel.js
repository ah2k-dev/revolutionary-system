const hotels = [
  {
    // saddar
    hotelName: "Luxury Resort",
    price: 250,
    description:
      "Experience the ultimate luxury and comfort at our 5-star resort.",
    services: ["Swimming Pool", "Spa", "Fine Dining", "Concierge"],
    capacity: 2,
  },
  {
    // garden west
    hotelName: "Cozy Inn",
    price: 100,
    description: "A charming inn perfect for a peaceful getaway.",
    services: ["Wi-Fi", "Restaurant", "Room Service"],
    capacity: 1,
  },
  {
    hotelName: "Seaside Retreat",
    price: 180,
    description:
      "Escape to our beachfront retreat and enjoy stunning ocean views.",
    services: ["Private Beach Access", "Water Sports", "Bar"],
    capacity: 4,
  },
  {
    hotelName: "Urban Oasis Hotel",
    price: 150,
    description: "A modern hotel nestled in the heart of the city.",
    services: ["Fitness Center", "Business Center", "Restaurant"],
    capacity: 3,
  },
  {
    hotelName: "Mountain Lodge",
    price: 120,
    description: "Discover the beauty of the mountains in our cozy lodge.",
    services: ["Hiking Trails", "Fireplace", "Restaurant"],
    capacity: 2,
  },
  {
    hotelName: "Historic Inn",
    price: 140,
    description:
      "Stay in a historic inn with period architecture and modern amenities.",
    services: ["Antique Furnishings", "Lounge", "Library"],
    capacity: 2,
  },
  {
    hotelName: "Riverside Retreat",
    price: 200,
    description: "Relax by the river at our tranquil retreat.",
    services: ["River Views", "Canoe Rentals", "Restaurant"],
    capacity: 2,
  },
  {
    hotelName: "Boutique Hotel",
    price: 170,
    description: "Indulge in luxury and style at our boutique hotel.",
    services: ["Spa", "Gourmet Dining", "Rooftop Bar"],
    capacity: 2,
  },
  {
    hotelName: "Countryside Inn",
    price: 90,
    description: "Experience the charm of the countryside in our quaint inn.",
    services: ["Gardens", "Farm-to-Table Dining"],
    capacity: 2,
  },
  {
    hotelName: "Ski Resort Lodge",
    price: 220,
    description: "Hit the slopes and unwind at our ski resort lodge.",
    services: ["Ski Rentals", "Hot Tub", "Apres-Ski Bar"],
    capacity: 4,
  },
];

// {
//   $group: {
//     _id: "$accommodationDetail.status",
//     currentCount: {
//       $sum: {
//         $cond: [
//           { $eq: ["$accommodationDetail.status", "current"] },
//           1,
//           0,
//         ],
//       },
//     },
//     previousCount: {
//       $sum: {
//         $cond: [
//           { $eq: ["$accommodationDetail.status", "previous"] },
//           1,
//           0,
//         ],
//       },
//     },
//     completedCount: {
//       $sum: {
//         $cond: [
//           { $eq: ["$accommodationDetail.status", "completed"] },
//           1,
//           0,
//         ],
//       },
//     },
//   },
// },

// /   try {
//     var url = "https://onesignal.com/api/v1/notifications";
//     var headers = {
//       "Content-Type": "application/json; charset=utf-8",
//       "Authorization":
//           "Basic MzdiNjgxNTktYzQ3Mi00ZjFjLWI4NDYtMDU1OWU1ZThlMzI5", //from one signal auth key
//     };
//     var body = {
//       "app_id": "07de94b6-8493-420f-8fc5-afc3aece3906",
//       "contents": {"en": message},
//       // "data": {
//       //   "myData": "whenTapOnNotificationIfNeededToPerformTask"
//       // }, //(optional)
//       "include_external_user_ids": [externalUserId],
//     };
//     var response = await ApiServices()
//         .postReq(endPoint: url, headers: headers, data: body);
//     if (response.statusCode == 200) {
//       debugPrint(
//           "OneSignal Notification sent successfully to $externalUserId");
//       return 1;
//     } else {
//       debugPrint("Error sending notification: ${response.statusCode}");
//       return 0;
//     }
//   } catch (e) {
//     debugPrint(e.toString());
//   }
