const DataModel = require('../models/dataModel');

// Thêm mock data để test (vì chưa kết nối database thật)
let mockData = [
    { id: 1, name: "Sample Item 1", description: "This is a sample item", createdAt: new Date() },
    { id: 2, name: "Sample Item 2", description: "Another sample item", createdAt: new Date() }
];

exports.getAllData = async (req, res) => {
    try {
        // Sử dụng mock data thay vì MongoDB
        res.status(200).json(mockData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
};

exports.createData = async (req, res) => {
    try {
        const newItem = {
            id: mockData.length + 1,
            ...req.body,
            createdAt: new Date()
        };
        mockData.push(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error adding data', error });
    }
};

exports.updateData = async (req, res) => {
    const { id } = req.params;
    try {
        const itemIndex = mockData.findIndex(item => item.id == id);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Data not found' });
        }
        mockData[itemIndex] = { ...mockData[itemIndex], ...req.body };
        res.status(200).json(mockData[itemIndex]);
    } catch (error) {
        res.status(400).json({ message: 'Error updating data', error });
    }
};

exports.deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        const itemIndex = mockData.findIndex(item => item.id == id);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Data not found' });
        }
        mockData.splice(itemIndex, 1);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data', error });
    }
};