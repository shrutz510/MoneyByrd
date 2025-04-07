// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import PetList from "./components/PetList";
import PetForm from "./components/PetForm";
import Loading from "./components/Loading";
import Notification from "./components/Notification";

const API = "http://localhost:8000";

export default function App() {
  const [pets, setPets] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    isVisible: false
  });
  
  // Store filter and search settings at App level instead of component level
  const [filterSettings, setFilterSettings] = useState({
    searchTerm: "",
    filterType: "all",
    sortBy: "name"
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const petRes = await axios.get(`${API}/pets`);
      const typeRes = await axios.get(`${API}/animal-types`);
      setPets(petRes.data);
      setAnimalTypes(typeRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      showNotification("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const handleAddPet = async (petData) => {
    try {
      await axios.post(`${API}/pets`, petData);
      await fetchData();
      showNotification(`${petData.name} has been added successfully!`);
      return true;
    } catch (err) {
      console.error("Add pet error:", err);
      showNotification(
        `Failed to add pet: ${err.response?.data?.error || err.message}`, 
        "error"
      );
      return false;
    }
  };

  const handleDeletePet = async (id) => {
    try {
      await axios.delete(`${API}/pets/${id}`);
      await fetchData();
      showNotification("Pet has been deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      showNotification("Failed to delete pet. Please try again.", "error");
    }
  };

  // Updated to avoid complete refresh after status changes
  const handleUpdatePet = async (id, key, value) => {
    try {
      const response = await axios.put(`${API}/pets/${id}`, { [key]: value });
      
      // Update the pet directly in state instead of re-fetching all pets
      setPets(currentPets => 
        currentPets.map(pet => 
          pet.id === id ? { ...pet, [key]: value } : pet
        )
      );
      
      showNotification("Pet updated successfully!");
      return response.data.pet;
    } catch (err) {
      console.error("Update error:", err);
      showNotification(
        `Failed to update pet: ${err.response?.data?.error || err.message}`, 
        "error"
      );
      return null;
    }
  };

  const handleAddAnimalType = async (animalTypeName) => {
    try {
      const res = await axios.post(`${API}/animal-types`, { name: animalTypeName });
      // Update animal types list without full reload
      setAnimalTypes(current => [...current, res.data]);
      showNotification(`Animal type "${animalTypeName}" has been added!`);
      return res.data.id;
    } catch (err) {
      console.error("Add animal type error:", err);
      showNotification("Failed to add animal type. Please try again.", "error");
      return null;
    }
  };

  // Handler to update filter settings
  const updateFilterSettings = (newSettings) => {
    setFilterSettings(current => ({
      ...current,
      ...newSettings
    }));
  };

  return (
    <div className="main-bg">
      <div className="container">
        <Notification 
          message={notification.message} 
          type={notification.type}
          isVisible={notification.isVisible} 
          setIsVisible={(isVisible) => setNotification(prev => ({...prev, isVisible}))} 
        />
        
        <header>
          <h1>Vet Management Dashboard</h1>
        </header>
        
        {loading ? (
          <Loading />
        ) : (
          <>
            <PetForm 
              animalTypes={animalTypes} 
              handleAddPet={handleAddPet} 
              handleAddAnimalType={handleAddAnimalType} 
            />
            
            <PetList 
              pets={pets} 
              animalTypes={animalTypes}
              handleUpdatePet={handleUpdatePet} 
              handleDeletePet={handleDeletePet}
              filterSettings={filterSettings}
              updateFilterSettings={updateFilterSettings}
            />
          </>
        )}
      </div>
    </div>
  );
}