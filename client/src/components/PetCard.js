// components/PetCard.js
import React from "react";

function PetCard({ pet, handleUpdatePet, handleDeletePet }) {

  const getPriorityClass = (priority) => {
    if (priority === "Low") return "priority-low";
    if (priority === "Medium") return "priority-medium";
    return "priority-high";
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    handleUpdatePet(pet.id, 'status', newStatus);
  };

  return (
    <div className="pet-card animate-fade-in">
      <div className="pet-card-header">
        <h3 className="pet-name">{pet.name}</h3>
      </div>
      <div className="pet-card-body">
        <div className="pet-info-item">
          <span className="pet-info-label">Status:</span>
          <div className="pet-info-value">
            <select
              value={pet.status}
              onChange={handleStatusChange}
              className="form-control"
            >
              <option>Available for Adoption</option>
              <option>Adopted</option>
              <option>In Care (Adopted)</option>
              <option>In Care (Not Adopted)</option>
            </select>
          </div>
        </div>
        
        <div className="pet-info-item">
          <span className="pet-info-label">Priority:</span>
          <div className="pet-info-value">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={`priority-indicator ${getPriorityClass(pet.priority)}`}></span>
              <select
                value={pet.priority}
                onChange={(e) => handleUpdatePet(pet.id, 'priority', e.target.value)}
                className="form-control"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="pet-info-item">
          <span className="pet-info-label">Animal Type:</span>
          <span className="pet-info-value">{pet.animal_type}</span>
        </div>
      </div>
      <div className="pet-card-footer">
        <button
          onClick={() => handleDeletePet(pet.id)}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default PetCard;