import api from './api';

/**
 * Quote API Service
 * All quote-related API calls
 */

const quoteService = {
  /**
   * Get all public quotes with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise} Quote data with pagination
   */
  getAllQuotes: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/quotes?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get quotes for a specific book
   * @param {string} bookId - Book ID
   * @returns {Promise} Array of quotes
   */
  getQuotesByBook: async (bookId) => {
    try {
      const response = await api.get(`/quotes/book/${bookId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single quote by ID
   * @param {string} id - Quote ID
   * @returns {Promise} Quote object
   */
  getQuoteById: async (id) => {
    try {
      const response = await api.get(`/quotes/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new quote
   * @param {Object} quoteData - Quote data
   * @returns {Promise} Created quote
   */
  createQuote: async (quoteData) => {
    try {
      const response = await api.post('/quotes', quoteData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a quote
   * @param {string} id - Quote ID
   * @param {Object} quoteData - Updated quote data
   * @returns {Promise} Updated quote
   */
  updateQuote: async (id, quoteData) => {
    try {
      const response = await api.put(`/quotes/${id}`, quoteData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a quote
   * @param {string} id - Quote ID
   * @returns {Promise} Success message
   */
  deleteQuote: async (id) => {
    try {
      const response = await api.delete(`/quotes/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Like a quote
   * @param {string} id - Quote ID
   * @returns {Promise} Updated quote
   */
  likeQuote: async (id) => {
    try {
      const response = await api.post(`/quotes/${id}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default quoteService;
