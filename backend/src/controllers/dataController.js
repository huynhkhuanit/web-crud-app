const DataModel = require('../models/dataModel');

// Mock data fallback (cho trường hợp database không kết nối được)
let mockData = [
    { id: 1, name: "Sample Item 1", description: "This is a sample item", createdAt: new Date() },
    { id: 2, name: "Sample Item 2", description: "Another sample item", createdAt: new Date() }
];

// Helper function để quyết định sử dụng database hay mock data
const shouldUseMockData = () => {
    return global.useMockData || !DataModel;
};

exports.getAllData = async (req, res) => {
    try {
        if (shouldUseMockData()) {
            // Sử dụng mock data
            res.status(200).json(mockData);
        } else {
            // Sử dụng MongoDB
            const data = await DataModel.find().sort({ createdAt: -1 });
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data
        res.status(200).json(mockData);
    }
};

exports.createData = async (req, res) => {
    try {
        if (shouldUseMockData()) {
            // Sử dụng mock data
            const newItem = {
                id: mockData.length + 1,
                ...req.body,
                createdAt: new Date()
            };
            mockData.push(newItem);
            res.status(201).json(newItem);
        } else {
            // Sử dụng MongoDB
            const newItem = new DataModel(req.body);
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        }
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(400).json({ message: 'Error adding data', error: error.message });
    }
};

exports.updateData = async (req, res) => {
    const { id } = req.params;
    try {
        if (shouldUseMockData()) {
            // Sử dụng mock data
            const itemIndex = mockData.findIndex(item => item.id == id);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Data not found' });
            }
            mockData[itemIndex] = { ...mockData[itemIndex], ...req.body };
            res.status(200).json(mockData[itemIndex]);
        } else {
            // Sử dụng MongoDB
            const updatedItem = await DataModel.findByIdAndUpdate(
                id, 
                req.body, 
                { new: true, runValidators: true }
            );
            
            if (!updatedItem) {
                return res.status(404).json({ message: 'Data not found' });
            }
            
            res.status(200).json(updatedItem);
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(400).json({ message: 'Error updating data', error: error.message });
    }
};

exports.deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        if (shouldUseMockData()) {
            // Sử dụng mock data
            const itemIndex = mockData.findIndex(item => item.id == id);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Data not found' });
            }
            mockData.splice(itemIndex, 1);
            res.status(204).send();
        } else {
            // Sử dụng MongoDB
            const deletedItem = await DataModel.findByIdAndDelete(id);
            
            if (!deletedItem) {
                return res.status(404).json({ message: 'Data not found' });
            }
            
            res.status(204).send();
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Error deleting data', error: error.message });
    }
};