require('dotenv').config();
const express = require('express');
const cors = require('./src/middleware/cors');
const connectDatabase = require('./src/config/database');

const app = express();
const apiRoutes = require('./src/routes/api');

const PORT = process.env.PORT || 5000;

// Kết nối database
connectDatabase();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: global.useMockData ? 'Mock Data' : 'MongoDB'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});