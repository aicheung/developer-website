const functions = require("firebase-functions");

exports.contact = functions
    .runWith({
      maxInstances: 1,
    })
    .https.onRequest((request, response) => {
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

      // If all validations pass, continue processing the form
      functions.logger.info("Contacted!", request);
      response.send("Thank you! I will get in touch with you shortly.");
    });
