require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Uses the already configured db
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/pets', require('./routes/pets'));
app.use('/animal-types', require('./routes/animalTypes'));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));