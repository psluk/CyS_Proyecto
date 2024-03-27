const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");
const serviceAccount = require("./emprendetec-7fe80-firebase-adminsdk.json");

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;