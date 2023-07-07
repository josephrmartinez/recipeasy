const functions = require('firebase-functions');
const fetch = require('node-fetch');
const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const { getStorage } = require('firebase/storage');


// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();



exports.imageProxy = functions.https.onRequest(async (req, res) => {
  const imageUrlParam = req.query.imageUrl;

  try {
    // Download the image from the URL
    const imageResponse = await fetch(imageUrlParam);
    const imageData = await imageResponse.buffer();

    // Upload the image to Firebase Cloud Storage
    const storageRef = ref(storage, 'images/recipe.jpg');
    await uploadBytes(storageRef, imageData);

    // Get the download URL of the stored image
    const downloadUrl = await getDownloadURL(storageRef);

    // Return the Firebase Storage URL as the response
    res.json({ imageUrl: downloadUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});