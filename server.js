const app = require('./app.js');
const dotenv = require('dotenv');
const http = require ('http');
const server = http.createServer(app);
dotenv.config();
const MY_PORT = process.env.PORT;
server.listen(MY_PORT);
