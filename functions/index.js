// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// Bring in axios to handle image fetch request
const axios = require('axios');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp({storageBucket: "gs://skiptorecipe-e2ede.appspot.com/"});


exports.saveImage = functions.https.onRequest(async (req, res) => {
    try {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }
  
      const { imageUrl, destination } = req.body;
  
      if (!imageUrl || !destination) {
        throw new Error('Invalid request: imageUrl and destination are required.');
      }
  
      const { data } = await axios.get(imageUrl, { responseType: 'stream' });
  
      const file = admin.storage().bucket().file(destination);
      const writeStream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            custom: 'metadata'
          }
        }
      })
  
      data.pipe(writeStream);
  
      writeStream.on('finish', () => {
        console.log('Successfully uploaded image');
        res.sendStatus(200);
      });
  
      writeStream.on('error', (error) => {
        console.error('Error uploading image:', error);
        res.sendStatus(500);
      });
    } catch (error) {
      console.error('Error fetching or uploading image:', error.message);
      res.sendStatus(500);
    }
  });
  