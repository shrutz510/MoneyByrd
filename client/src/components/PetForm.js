// components/PetForm.js with enhanced validation
import React, { useState } from "react";

function PetForm({ animalTypes = [], handleAddPet, handleAddAnimalType }) {
  const [newPet, setNewPet] = useState({ 
    name: "", 
    animal_type_id: "", 
    new_animal_type: "", 
    priority: "Medium", 
    status: "Available for Adoption"
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPet({ ...newPet, [name]: value });
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    
    // Special handling for animal_type_id and new_animal_type to clear conflicts
    if (name === 'animal_type_id' && value && newPet.new_animal_type) {
      setNewPet(prev => ({ ...prev, new_animal_type: '' }));
    } else if (name === 'new_animal_type' && value && newPet.animal_type_id) {
      setNewPet(prev => ({ ...prev, animal_type_id: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if pet name is provided
    if (!newPet.name.trim()) {
      newErrors.name = "Pet name is required";
    }
    
    // Check animal type validation
    if (!newPet.animal_type_id && !newPet.new_animal_type.trim()) {
      newErrors.animal_type = "Please select an existing animal type or enter a new one";
    }
    
    // Check if both animal type and new animal type are specified
    if (newPet.animal_type_id && newPet.new_animal_type.trim()) {
      newErrors.animal_type = "Please either select an existing animal type OR enter a new one, not both";
    }
    
    // Check if new animal type already exists
    if (newPet.new_animal_type.trim()) {
      const normalizedNewType = newPet.new_animal_type.trim().toLowerCase();
      const typeExists = animalTypes.some(type => 
        type.name.toLowerCase() === normalizedNewType
      );
      
      if (typeExists) {
        newErrors.new_animal_type = "This animal type already exists. Please select it from the dropdown instead";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    let animalTypeId = newPet.animal_type_id;

    if (newPet.new_animal_type.trim()) {
      const newTypeId = await handleAddAnimalType(newPet.new_animal_type.trim());
      if (newTypeId) {
        animalTypeId = newTypeId;
      } else {
        setErrors({ 
          ...errors, 
          new_animal_type: "Failed to add new animal type. Please try again." 
        });
        return;
      }
    }

    // Prepare pet data
    const petData = {
      name: newPet.name.trim(),
      animal_type_id: animalTypeId,
      priority: newPet.priority,
      status: newPet.status,
    };

    const success = await handleAddPet(petData);
    
    if (success) {
      // Reset form
      setNewPet({ 
        name: "", 
        animal_type_id: "", 
        new_animal_type: "", 
        priority: "Medium", 
        status: "Available for Adoption"
      });
      setErrors({});
    }
  };

  return (
    <div className="form-container">
      <h2 className="section-header">Add New Pet</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
          <label htmlFor="name">
            Pet Name <span className="required-asterisk">*</span>
          </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter pet name"
              value={newPet.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-field">
            <label htmlFor="animal_type_id">Animal Type</label>
            <select
              id="animal_type_id"
              name="animal_type_id"
              onChange={handleInputChange}
              value={newPet.animal_type_id}
              className={errors.animal_type ? "error" : ""}
            >
              <option value="">Select Animal Type</option>
              {animalTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {errors.animal_type && <div className="error-message">{errors.animal_type}</div>}
          </div>
          
          <div className="form-field">
            <label htmlFor="new_animal_type">New Animal Type (Optional)</label>
            <input
              id="new_animal_type"
              type="text"
              name="new_animal_type"
              placeholder="Add new animal type"
              value={newPet.new_animal_type}
              onChange={handleInputChange}
              className={errors.new_animal_type ? "error" : ""}
            />
            {errors.new_animal_type && <div className="error-message">{errors.new_animal_type}</div>}
          </div>
        </div>
        
        <div className="form-second-row">
          <div className="form-field">
            <label htmlFor="priority">Priority</label>
            <select 
              id="priority"
              name="priority" 
              onChange={handleInputChange} 
              value={newPet.priority}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          
          <div className="form-field">
            <label htmlFor="status">Adoption Status</label>
            <select 
              id="status"
              name="status" 
              onChange={handleInputChange} 
              value={newPet.status}
            >
              <option>Available for Adoption</option>
              <option>Adopted</option>
              <option>In Care (Adopted)</option>
              <option>In Care (Not Adopted)</option>
            </select>
          </div>
        </div>
        
        <div className="button-container">
          <button type="submit" className="add-pet-button">
            <span className="plus-icon">+</span> Add Pet
          </button>
        </div>
      </form>
    </div>
  );
}

export default PetForm;