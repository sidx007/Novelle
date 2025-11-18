import api from './api';

/**
 * Book API Service
 * All book-related API calls
 */

const bookService = {
  /**
   * Get all books with pagination and optional search
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @param {string} search - Search query (optional)
   * @param {string} genre - Genre filter (optional)
   * @returns {Promise} Book data with pagination
   */
  getAllBooks: async (page = 1, limit = 20, search = '', genre = '') => {
    try {
      let url = `/books?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (genre) url += `&genre=${encodeURIComponent(genre)}`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single book by ID
   * @param {string} id - Book ID
   * @returns {Promise} Book object
   */
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new book
   * @param {Object} bookData - Book data
   * @returns {Promise} Created book
   */
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a book
   * @param {string} id - Book ID
   * @param {Object} bookData - Updated book data
   * @returns {Promise} Updated book
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a book
   * @param {string} id - Book ID
   * @returns {Promise} Success message
   */
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search books by title or author
   * @param {string} query - Search query
   * @returns {Promise} Array of matching books
   */
  searchBooks: async (query) => {
    try {
      const response = await api.get(`/books?search=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default bookService;
