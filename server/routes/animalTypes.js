const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all animal types
router.get('/', (req, res) => {
  db.all('SELECT * FROM animal_types ORDER BY name ASC', (err, types) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(types);
  });
});

// POST create new animal type
router.post('/', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Animal type name is required' });
  }

  db.run('INSERT INTO animal_types (name) VALUES (?)', [name], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({ 
      id: this.lastID,
      name 
    });
  });
});

module.exports = router;