const apiUrl = 'http://localhost:5000/api';

// Function to fetch all data
async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}/data`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to add new data
async function addData(newData) {
    try {
        const response = await fetch(`${apiUrl}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding data:', error);
    }
}

// Function to update existing data
async function updateData(id, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

// Function to delete data
async function deleteData(id) {
    try {
        const response = await fetch(`${apiUrl}/data/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}