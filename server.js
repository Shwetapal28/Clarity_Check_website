const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public")); // Static frontend

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 📨 Email Sending Route
app.post("/send", async (req, res) => {
  const { company, name, yearEnd, activity, reference, email, service } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const messageToOwner = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: `New Clarity Check Submission - ${company}`,
    text: `
New inquiry received:

Company: ${company}
Name: ${name}
Year End: ${yearEnd}
Activity: ${activity}
Reference: ${reference}
Email: ${email}
Service: ${service}
    `,
  };

  const confirmationToClient = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Thank You for Reaching Out to Clarity Check",
    text: `Dear ${name},

Thank you for getting in touch with Clarity Check.

We’ve received your enquiry and the details you submitted through our website. One of our team members will review the information and get back to you within 3–4 working days. We’re currently experiencing a high volume of requests, and we truly appreciate your patience.

At Clarity Check, our goal is to provide thoughtful, independent insights that help you better understand and manage your financial information — whether it's through our Clarity Check review or our Bookkeeping Review service.

If your request is urgent or if you’d like to provide any additional details, feel free to get in touch with us on admin@clarity-check.co.uk

Warm regards,  
Clarity Check Team`,
  };

  try {
    await transporter.sendMail(messageToOwner);
    await transporter.sendMail(confirmationToClient);
    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Email failed" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Serve index.html for unknown routes (important for Render)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
