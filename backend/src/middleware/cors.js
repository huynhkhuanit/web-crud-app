const cors = require('cors');

const corsOptions = {
    origin: '*', // Cho phép tất cả origins để test
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);