import axios from 'axios';
const BASE = 'http://localhost:8000';

export const getPets = () => axios.get(`${BASE}/pets`);
export const addPet = (pet) => axios.post(`${BASE}/pets`, pet);
export const updatePet = (id, data) => axios.put(`${BASE}/pets/${id}`, data);
export const deletePet = (id) => axios.delete(`${BASE}/pets/${id}`);

export const getAnimalTypes = () => axios.get(`${BASE}/animal-types`);
export const addAnimalType = (name) => axios.post(`${BASE}/animal-types`, { name });
