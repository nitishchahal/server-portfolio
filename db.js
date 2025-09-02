// import mysql from 'mysql2/promise';

// // Create a connection pool to manage database connections
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// // Function to create the 'contacts' table if it doesn't exist
// async function initializeDatabase() {
//     try {
//         const connection = await pool.getConnection();
//         const createTableQuery = `
//             CREATE TABLE IF NOT EXISTS contacts (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) NOT NULL,
//                 subject VARCHAR(255),
//                 message TEXT NOT NULL,
//                 date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             )
//         `;
//         await connection.execute(createTableQuery);
//         console.log('Contacts table checked/created successfully.');
//         connection.release();
//     } catch (error) {
//         console.error('Error initializing database:', error);
//         process.exit(1); // Exit the process if we can't connect to the database
//     }
// }

// export { pool, initializeDatabase };




import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolioDB";

// Function to connect to MongoDB
async function initializeDatabase() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Define Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Create Contact model
const Contact = mongoose.model("Contact", contactSchema);

export { initializeDatabase, Contact };
