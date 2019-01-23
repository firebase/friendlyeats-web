const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Listen for new reviews to a given restaurant
exports.updateReviewScore = functions.firestore
   .document('restaurants/{restaurantId}/ratings/{ratingsId}')
   .onCreate((snap, context) => {
        /*
            TODO: Implement updating the restaurant rating
        */
   });

exports.sendRatingsToBigQuery = functions.firestore
   .document('restaurants/{restaurantId}/ratings/{ratingsId}')
   .onCreate((snap, context) => {
        /*
            TODO: Implement syncronization with BigQuery
        */
   });
