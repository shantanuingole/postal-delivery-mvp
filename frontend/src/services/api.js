import axios from 'axios';

// Get API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Validate address or PIN code
 * @param {Object} addressData - { address, pincode, district }
 * @returns {Promise} API response
 */
export const validateAddress = async (addressData) => {
  try {
    const response = await api.post('/address/validate', addressData);
    return response.data;
  } catch (error) {
    console.error('Validation error:', error);
    throw error.response?.data || { 
      success: false, 
      message: 'Network error. Make sure backend is running.' 
    };
  }
};

/**
 * Search localities by query
 * @param {string} query - Search term
 * @returns {Promise} API response
 */
export const searchLocalities = async (query) => {
  try {
    const response = await api.get(`/address/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error.response?.data || { 
      success: false, 
      message: 'Search failed' 
    };
  }
};

export const calculateRoute = async (routeData) => {
  try {
    const response = await api.post('/routing/calculate', routeData);
    return response.data;
  } catch (error) {
    console.error('Routing error:', error);
    throw error.response?.data || { 
      success: false, 
      message: 'Route calculation failed' 
    };
  }
};

export default api;
