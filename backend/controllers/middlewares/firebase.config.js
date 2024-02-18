const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountfirebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://socialsnap-90735.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
