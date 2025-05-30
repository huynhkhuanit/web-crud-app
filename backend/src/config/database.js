const mongoose = require('mongoose');

// Database connection function
const connectDatabase = async () => {
    try {
        // MongoDB connection string - sẽ được set từ environment variable
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web-crud-app';
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        };

        const conn = await mongoose.connect(MONGODB_URI, options);
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Tạo sample data nếu database trống
        await createSampleData();
        
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        
        // Fallback to mock data if database connection fails
        console.log('🔄 Falling back to mock data...');
        global.useMockData = true;
    }
};

// Tạo sample data nếu cần
const createSampleData = async () => {
    try {
        const Data = require('../models/dataModel');
        const count = await Data.countDocuments();
        
        if (count === 0) {
            const sampleData = [
                {
                    name: "Sample Item 1",
                    description: "This is a sample item from MongoDB",
                },
                {
                    name: "Sample Item 2", 
                    description: "Another sample item from MongoDB",
                }
            ];
            
            await Data.insertMany(sampleData);
            console.log('📝 Sample data created successfully');
        }
    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    }
};

module.exports = connectDatabase; 