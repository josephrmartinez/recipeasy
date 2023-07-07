/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const fetch = require('node-fetch');
const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const admin = initializeApp();
const storage = getStorage(admin);

exports.imageProxy = functions.https.onRequest(async (req, res) => {
  const imageUrl = req.query.imageUrl;

  try {
    // Download the image from the URL
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.buffer();

    // Upload the image to Firebase Cloud Storage
    const storageRef = ref(storage, 'images/recipe.jpg');
    await uploadBytes(storageRef, imageData);

    // Get the download URL of the stored image
    const imageUrl = await getDownloadURL(storageRef);

    // Return the Firebase Storage URL as the response
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});