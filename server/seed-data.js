// scripts/seed-data.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'vet-management.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample data
const animalTypes = [
  { name: 'Dog' },
  { name: 'Cat' },
  { name: 'Bird' },
  { name: 'Rabbit' },
  { name: 'Hamster' },
  { name: 'Fish' },
  { name: 'Turtle' },
  { name: 'Chicken' },
  { name: 'Snake' }
];

const pets = [
  {
    name: 'Max',
    status: 'Available for Adoption',
    animal_type: 'Dog',
    priority: 'Medium'
  },
  {
    name: 'Bella',
    status: 'Adopted',
    animal_type: 'Dog',
    priority: 'Low'
  },
  {
    name: 'Charlie',
    status: 'In Care (Not Adopted)',
    animal_type: 'Cat',
    priority: 'High'
  },
  {
    name: 'Luna',
    status: 'Available for Adoption',
    animal_type: 'Cat',
    priority: 'Medium'
  },
  {
    name: 'Oliver',
    status: 'Adopted',
    animal_type: 'Rabbit',
    priority: 'Low'
  },
  {
    name: 'Lucy',
    status: 'In Care (Adopted)',
    animal_type: 'Bird',
    priority: 'Medium'
  },
  {
    name: 'Cooper',
    status: 'Available for Adoption',
    animal_type: 'Hamster',
    priority: 'Low'
  },
  {
    name: 'Daisy',
    status: 'In Care (Not Adopted)',
    animal_type: 'Turtle',
    priority: 'High'
  },
  {
    name: 'Milo',
    status: 'Adopted',
    animal_type: 'Dog',
    priority: 'High'
  },
  {
    name: 'Zoe',
    status: 'Available for Adoption',
    animal_type: 'Fish',
    priority: 'Low'
  },
  {
    name: 'Rocky',
    status: 'In Care (Adopted)',
    animal_type: 'Dog',
    priority: 'Medium'
  },
  {
    name: 'Lily',
    status: 'Available for Adoption',
    animal_type: 'Chicken',
    priority: 'Medium'
  },
  {
    name: 'Duke',
    status: 'Adopted',
    animal_type: 'Cat',
    priority: 'Low'
  },
  {
    name: 'Coco',
    status: 'In Care (Not Adopted)',
    animal_type: 'Bird',
    priority: 'High'
  },
  {
    name: 'Henry',
    status: 'Adopted',
    animal_type: 'Chicken',
    priority: 'High'
  }
];

// Start seeding process
console.log('Starting database seeding...');

// Set up foreign key support
db.run('PRAGMA foreign_keys = ON');

// First create tables if they don't exist
console.log('Creating tables if needed...');

// Create animal_types table
db.run(`
  CREATE TABLE IF NOT EXISTS animal_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Error creating animal_types table:', err);
    db.close();
    return;
  }
  
  // Create pets table without owner_id
  db.run(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'Available for Adoption',
      animal_type_id INTEGER,
      priority TEXT DEFAULT 'Medium',
      FOREIGN KEY (animal_type_id) REFERENCES animal_types(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating pets table:', err);
      db.close();
      return;
    }
    
    // Now insert animal types
    console.log('Inserting animal types...');
    
    // Use a counter to track when all inserts are done
    let animalTypesInserted = 0;
    
    animalTypes.forEach(type => {
      db.run('INSERT OR IGNORE INTO animal_types (name) VALUES (?)', [type.name], function(err) {
        if (err) {
          console.error(`Error inserting animal type ${type.name}:`, err);
        } else {
          animalTypesInserted++;
          
          // When all animal types are inserted, proceed with pets
          if (animalTypesInserted === animalTypes.length) {
            insertPets();
          }
        }
      });
    });
    
    function insertPets() {
      // Get animal type IDs for reference when inserting pets
      db.all('SELECT id, name FROM animal_types', (err, animalTypeRows) => {
        if (err) {
          console.error('Error retrieving animal types:', err);
          db.close();
          return;
        }

        console.log('Inserting pets...');
        
        // Create a map of animal type names to IDs
        const animalTypeMap = {};
        animalTypeRows.forEach(row => {
          animalTypeMap[row.name] = row.id;
        });

        // Counter for tracking pet insertions
        let petsInserted = 0;
        
        // Insert all pets
        pets.forEach(pet => {
          const animalTypeId = animalTypeMap[pet.animal_type];
          if (!animalTypeId) {
            console.warn(`Animal type '${pet.animal_type}' not found for pet '${pet.name}'`);
            petsInserted++;
            return;
          }

          db.run(
            'INSERT INTO pets (name, status, animal_type_id, priority) VALUES (?, ?, ?, ?)',
            [pet.name, pet.status, animalTypeId, pet.priority],
            function(err) {
              if (err) {
                console.error(`Error inserting pet ${pet.name}:`, err);
              } else {
                console.log(`Inserted pet: ${pet.name} (${pet.animal_type})`);
              }
              
              petsInserted++;
              
              // When all pets are inserted, display summary and close connection
              if (petsInserted === pets.length) {
                finishSeeding();
              }
            }
          );
        });
      });
    }
    
    function finishSeeding() {
      console.log('Seeding completed!');
      
      // Verify data was inserted correctly
      db.get('SELECT COUNT(*) as count FROM animal_types', (err, row) => {
        if (err) {
          console.error('Error counting animal types:', err);
        } else {
          console.log(`Total animal types: ${row.count}`);
        }
        
        db.get('SELECT COUNT(*) as count FROM pets', (err, row) => {
          if (err) {
            console.error('Error counting pets:', err);
          } else {
            console.log(`Total pets: ${row.count}`);
          }
          
          // Close database connection
          db.close();
        });
      });
    }
  });
});