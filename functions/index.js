const functions = require("firebase-functions");
const app = require("./src/app");


//🚀 Deploy Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
