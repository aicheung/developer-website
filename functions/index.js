const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const database = admin.database();

exports.contact = functions
    .runWith({
      maxInstances: 1,
    })
    .https.onRequest(async (request, response) => {
      const {name, email, message} = request.body;

      // Name validation
      if (!name || name.trim().length === 0) {
        response.status(400).send("Name must not be blank.");
        return;
      }

      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailRegex.test(email)) {
        response.status(400).send("Please provide a valid email.");
        return;
      }

      // Message validation
      if (!message ||
      message.trim().length === 0 ||
      message.trim().length > 5000) {
        response
            .status(400)
            .send(
                "Message must not be blank (maximum 5000 characters).",
            );
        return;
      }

      // If all validations pass, store the message in the Realtime Database
      const newMessageRef = database.ref("messages").push();
      try {
        await newMessageRef.set({
          name,
          email,
          message,
          timestamp: Date(),
        });
        functions.logger.info("Message saved:", newMessageRef.key);
        response.send( "Thank you! I will get in touch with you shortly.");
      } catch (error) {
        functions.logger.error("Error saving message:", error);
        response
            .status(500)
            .send("Error saving message. Please try again later.");
      }
    });
