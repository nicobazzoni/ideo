const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendLikeNotification = functions.firestore
  .document('ideas/{ideaId}/likes/{likeId}')
  .onCreate(async (snapshot, context) => {
    const { ideaId } = context.params; // Updated to reflect 'ideas' collection
    const likeData = snapshot.data();

    // Retrieve the idea document
    const ideaRef = admin.firestore().collection('ideas').doc(ideaId);
    const ideaDoc = await ideaRef.get();

    if (!ideaDoc.exists) {
      console.log(`Idea ${ideaId} does not exist.`);
      return;
    }

    const ideaOwnerId = ideaDoc.data().ownerId;

    // Retrieve the idea owner's FCM token
    const userRef = admin.firestore().collection('users').doc(ideaOwnerId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`User ${ideaOwnerId} does not exist.`);
      return;
    }

    const fcmToken = userDoc.data().fcmToken;

    if (!fcmToken) {
      console.log(`User ${ideaOwnerId} does not have an FCM token.`);
      return;
    }

    // Send a notification to the idea owner
    const payload = {
      notification: {
        title: 'New Like!',
        body: `${likeData.userName} liked your idea.`,
      },
    };

    try {
      await admin.messaging().sendToDevice(fcmToken, payload);
      console.log(`Notification sent to user ${ideaOwnerId}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });