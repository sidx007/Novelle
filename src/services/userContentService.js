import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const userContentService = {
  createQuoteWithBook: async ({ book, quote }) => {
    try {
      const response = await axios.post(
        `${API_URL}/user-content/quotes`,
        { book, quote },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to publish quote' };
    }
  }
};

export default userContentService;
