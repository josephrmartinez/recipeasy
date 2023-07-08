// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// Bring in axios to handle image fetch request
const axios = require('axios');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp({storageBucket: "gs://skiptorecipe-e2ede.appspot.com/"});


exports.saveImage = functions.https.onCall(async (data, context) => {
    try {
      const { imageUrl, destination } = data;
  
      if (!imageUrl || !destination) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid request: imageUrl and destination are required.'
        );
      }
  
      const { data: imageStream } = await axios.get(imageUrl, {
        responseType: 'stream',
      });
  
      const file = admin.storage().bucket().file(destination);
      const writeStream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            custom: 'metadata'
          }
        }
      });
  
      imageStream.pipe(writeStream);
  
      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          console.log('Successfully uploaded image');
          resolve('Image saved successfully.');
        });
  
        writeStream.on('error', (error) => {
          console.error('Error uploading image:', error);
          reject(new functions.https.HttpsError('internal', 'Error uploading image.'));
        });
      });
    } catch (error) {
      console.error('Error fetching or uploading image:', error.message);
      throw new functions.https.HttpsError('internal', 'Error fetching or uploading image.');
    }
  });