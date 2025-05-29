const express = require('express');
const cors = require('./src/middleware/cors');
const app = express();
const apiRoutes = require('./src/routes/api');

const PORT = process.env.PORT || 5000;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});