import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Expo } from "expo-server-sdk";
import cors from "cors";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
const expo = new Expo();
const PORT = process.env.PORT || 8000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.post("/send-sms", async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      res.status(400).json({ error: "Missing required fields: to, message" });
      return;
    }

    const response = await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to: to,
      body: message,
    });

    res.json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
