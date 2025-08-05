import mysql from 'mysql2/promise';

// Create a connection pool to manage database connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Function to create the 'contacts' table if it doesn't exist
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.execute(createTableQuery);
        console.log('Contacts table checked/created successfully.');
        connection.release();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1); // Exit the process if we can't connect to the database
    }
}

export { pool, initializeDatabase };
