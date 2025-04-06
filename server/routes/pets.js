const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all pets
router.get('/', (req, res) => {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.status, 
      p.animal_type_id,
      a.name as animal_type, 
      p.priority
    FROM pets p
    LEFT JOIN animal_types a ON p.animal_type_id = a.id
  `;
  
  db.all(query, [], (err, pets) => {
    if (err) {
      console.error('Error retrieving pets:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(pets);
  });
});

// POST create a new pet
router.post('/', (req, res) => {
  const { name, status, animal_type_id, priority } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Pet name is required' });
  }
  
  const query = `
    INSERT INTO pets (name, status, animal_type_id, priority) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [name, status, animal_type_id, priority], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get the created pet with animal type name
    db.get(`
      SELECT 
        p.id, 
        p.name, 
        p.status, 
        p.animal_type_id,
        a.name as animal_type, 
        p.priority
      FROM pets p
      LEFT JOIN animal_types a ON p.animal_type_id = a.id
      WHERE p.id = ?
    `, [this.lastID], (err, newPet) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.status(201).json(newPet);
    });
  });
});

// PUT update pet status or priority
router.put('/:id', (req, res) => {
  const { status, priority } = req.body;
  const petId = req.params.id;
  
  // First, get the current pet
  db.get('SELECT * FROM pets WHERE id = ?', [petId], (err, pet) => {
    if (err) {
      console.error('Error retrieving pet:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    const updates = [];
    const params = [];
    
    // Handle status updates
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    
    // Handle priority updates
    if (priority) {
      updates.push('priority = ?');
      params.push(priority);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    params.push(petId);
    const query = `UPDATE pets SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('Update error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pet not found or no changes made' });
      }
      
      // Get the updated pet to return in the response
      db.get('SELECT * FROM pets WHERE id = ?', [petId], (err, updatedPet) => {
        if (err) {
          return res.status(200).json({
            message: 'Pet updated successfully, but unable to retrieve updated details',
            petId: petId
          });
        }
        
        res.json({
          message: 'Pet updated successfully',
          pet: updatedPet
        });
      });
    });
  });
});

// DELETE pet by id
router.delete('/:id', (req, res) => {
  const petId = req.params.id;
  
  // First check if the pet exists
  db.get('SELECT id FROM pets WHERE id = ?', [petId], (err, pet) => {
    if (err) {
      console.error('Error checking pet existence:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // If pet exists, proceed with deletion
    db.run('DELETE FROM pets WHERE id = ?', [petId], function(err) {
      if (err) {
        console.error('Error deleting pet:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        message: 'Pet deleted successfully', 
        id: petId 
      });
    });
  });
});

module.exports = router;