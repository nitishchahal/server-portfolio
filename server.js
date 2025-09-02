// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { pool, initializeDatabase } from './db.js'; // Import from db.js

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // ✅ Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the backend server');
// });

// // API Endpoint to handle contact form submissions
// app.post('/api/contact', async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     // Basic server-side validation
//     if (!name || !email || !message) {
//       return res.status(400).json({ error: 'Name, email, and message are required.' });
//     }

//     const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
//     const [rows] = await pool.execute(query, [name, email, subject, message]);

//     res.status(201).json({ message: 'Message sent successfully!', insertId: rows.insertId });
//   } catch (error) {
//     console.error('Error saving contact:', error);
//     res.status(500).json({ error: 'Failed to send message.' });
//   }
// });

// // Start the server after initializing the database
// initializeDatabase().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }).catch(err => {
//   console.error('Server startup failed:', err);
// });



import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeDatabase, Contact } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Welcome to the backend server (MongoDB version)");
});

// API Endpoint to handle contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required." });
    }

    const newContact = new Contact({ name, email, subject, message });
    const savedContact = await newContact.save();

    res.status(201).json({
      message: "Message sent successfully!",
      id: savedContact._id,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Optional: Fetch all contact submissions (admin)
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// Start the server after initializing the database
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
