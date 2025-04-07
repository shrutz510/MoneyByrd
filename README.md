# Vet Management System Documentation

## Overview

The Vet Management System is a full-stack web application designed to help veterinary clinics manage pets and their adoption status. The system allows users to create, update, and delete pet records, categorize pets by animal type, and filter/sort the pet list for easy management.

## Features

- **Pet Management**: Add, edit, and delete pet records
- **Animal Type Management**: Use existing animal types or create new ones
- **Status Tracking**: Track pet adoption status (Available for Adoption, Adopted, In Care)
- **Priority Levels**: Assign priority levels to pets (Low, Medium, High)
- **Search & Filter**: Search pets by name and filter by animal type
- **Sorting**: Sort pets by name or priority level
- **Validation**: Form validation to prevent duplicates and ensure data quality
- **Notifications**: Visual feedback for user actions

## System Architecture

The application follows a client-server architecture:

- **Frontend**: React.js application with components for forms, lists, and cards
- **Backend**: Node.js with Express.js REST API
- **Database**: SQLite for data storage

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/vet-management.git
   cd vet-management
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Set up the database:
   ```
   node seed-data.js
   ```

4. Start the backend server:
   ```
   npm start
   ```
   The server should now be running on http://localhost:8000

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```
   cd ../client
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```
   The frontend application should open automatically in your browser at http://localhost:3000

## API Endpoints

### Pets API

- **GET /pets** - Retrieve all pets
- **POST /pets** - Create a new pet
- **PUT /pets/:id** - Update a pet's details
- **DELETE /pets/:id** - Delete a pet

### Animal Types API

- **GET /animal-types** - Retrieve all animal types
- **POST /animal-types** - Create a new animal type

## Database Schema

### animal_types Table
- **id** (INTEGER): Primary key
- **name** (TEXT): Animal type name (unique)

### pets Table
- **id** (INTEGER): Primary key
- **name** (TEXT): Pet name
- **status** (TEXT): Adoption status
- **animal_type_id** (INTEGER): Foreign key referencing animal_types
- **priority** (TEXT): Priority level

## Component Structure

- **App**: Main application component that handles data fetching and state management
- **PetForm**: Form for adding new pets
- **PetList**: Displays the list of pets with search, filter, and sort controls
- **PetCard**: Displays individual pet information
- **Notification**: Shows success/error messages
- **Loading**: Displays a loading indicator

## Usage Guide

### Adding a New Pet

1. Fill in the "Pet Name" field (required)
2. Select an existing "Animal Type" or add a new one in "New Animal Type"
3. Set the "Priority" (Low, Medium, High)
4. Select the "Adoption Status"
5. Click "Add Pet"

### Managing Pets

- **Update Status**: Select a new status from the dropdown in a pet card
- **Change Priority**: Select a new priority from the dropdown in a pet card
- **Delete Pet**: Click the "Delete" button on a pet card

### Searching and Filtering

- **Search**: Enter text in the search box to find pets by name
- **Filter**: Select an animal type from the filter dropdown to show only pets of that type
- **Sort**: Select a sort option to order pets by name or priority

## Validation Rules

- Pet name is required
- Cannot have both an animal type selected and a new animal type entered
- Cannot add a new animal type that already exists (case-insensitive)
- All validation errors are displayed to the user

## Troubleshooting

### Database Issues

If you encounter database-related errors:

1. Stop the server
2. Delete the `vet-management.sqlite` file
3. Run the seed script again: `node seed-data.js`
4. Restart the server

### API Connection Issues

If the frontend can't connect to the backend:

1. Verify the server is running at http://localhost:8000
2. Check the API URL in the frontend code (App.js)
3. Ensure there are no CORS issues by checking browser console errors

## Development Notes

### Adding New Features

1. Update the database schema if necessary
2. Add new API endpoints in the appropriate route files
3. Update frontend components to utilize the new functionality
4. Add validation for any new fields/features

### Code Style

- Use camelCase for variable and function names
- Use PascalCase for component names
- Add comments for complex logic
- Maintain consistent indentation and formatting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name] - Initial development
