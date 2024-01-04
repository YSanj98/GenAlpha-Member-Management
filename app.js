const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, 'config', '.env') }); // Define the path to your .env file
  }

  module.exports = app;