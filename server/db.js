const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'vet-management.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables and seed data
db.serialize(() => {
  // Create animal_types table
  db.run(`CREATE TABLE IF NOT EXISTS animal_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )`);

  // Seed predefined animal types
  const defaultTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish'];
  defaultTypes.forEach(type => {
    db.run(`INSERT OR IGNORE INTO animal_types (name) VALUES (?)`, [type]);
  });

  // Create pets table 
  db.run(`CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Available for Adoption',
    animal_type_id INTEGER,
    priority TEXT DEFAULT 'Medium',
    FOREIGN KEY (animal_type_id) REFERENCES animal_types(id)
  )`);
  
  // Log database initialization status
  console.log("Database initialized with pets table");

});

module.exports = db;