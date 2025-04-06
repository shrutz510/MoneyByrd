// components/PetList.js
import React, { useMemo } from "react";
import PetCard from "./PetCard";

function PetList({ 
  pets, 
  animalTypes, 
  handleUpdatePet, 
  handleDeletePet,
  filterSettings,
  updateFilterSettings
}) {
  // Use filter settings from props instead of local state
  const { searchTerm, filterType, sortBy } = filterSettings;

  // Get unique animal types for filter dropdown, sorted alphabetically
  const petAnimalTypes = useMemo(() => {
    const types = new Set(pets.map(pet => pet.animal_type));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [pets]);

  // Apply filtering, searching, and sorting
  const filteredAndSortedPets = useMemo(() => {
    let result = [...pets];
    
    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(pet => 
        pet.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      result = result.filter(pet => pet.animal_type === filterType);
    }
    
    // Apply sorting
    return result.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "priority-desc") {
        const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [pets, searchTerm, filterType, sortBy]);

  // Event handlers to update filter settings in parent component
  const handleSearchChange = (e) => {
    updateFilterSettings({ searchTerm: e.target.value });
  };

  const handleFilterChange = (e) => {
    updateFilterSettings({ filterType: e.target.value });
  };

  const handleSortChange = (e) => {
    updateFilterSettings({ sortBy: e.target.value });
  };

  return (
    <div className="pet-list-container">
      <div className="pet-list-header">
        <h2 className="section-header">Pet List</h2>
      </div>
      
      <div className="pet-list-controls">
        <div className="search-control">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search pets by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-control">
          <label>Filter by:</label>
          <select 
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="all">All Animal Types</option>
            {petAnimalTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="sort-control">
          <label>Sort by:</label>
          <select 
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="name">Name (A-Z)</option>
            <option value="priority">Priority (Low to High)</option>
            <option value="priority-desc">Priority (High to Low)</option>
          </select>
        </div>
      </div>
      
      {filteredAndSortedPets.length === 0 ? (
        <div className="no-pets-message">
          {searchTerm 
            ? `No pets found matching "${searchTerm}"` 
            : filterType !== "all"
              ? `No pets found for animal type "${filterType}"`
              : "No pets available."}
        </div>
      ) : (
        <div className="pet-grid">
          {filteredAndSortedPets.map((pet) => (
            <PetCard 
              key={pet.id}
              pet={pet}
              handleUpdatePet={handleUpdatePet}
              handleDeletePet={handleDeletePet}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PetList;