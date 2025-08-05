import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pool, initializeDatabase } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Simple validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
        const [rows] = await pool.execute(query, [name, email, subject, message]);

        res.status(201).json({ message: 'Message sent successfully!', insertId: rows.insertId });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// Start the server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Server startup failed:', err);
});