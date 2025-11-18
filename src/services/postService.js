import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postService = {
  // Get all public posts
  getAllPosts: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },

  // Get single post
  getPost: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch post' };
    }
  },

  // Create post (requires auth)
  createPost: async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create post' };
    }
  },

  // Update post (requires auth)
  updatePost: async (postId, postData) => {
    try {
      const response = await axios.put(`${API_URL}/posts/${postId}`, postData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update post' };
    }
  },

  // Delete post (requires auth)
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete post' };
    }
  },

  likeQuote: async (quoteId) => {
    try {
      const response = await axios.post(
        `${API_URL}/interactions/quotes/${quoteId}/like`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to like quote' };
    }
  },

  unlikeQuote: async (quoteId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/interactions/quotes/${quoteId}/like`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to unlike quote' };
    }
  },

  saveQuote: async (quoteId) => {
    try {
      const response = await axios.post(
        `${API_URL}/interactions/quotes/${quoteId}/save`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save quote' };
    }
  },

  unsaveQuote: async (quoteId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/interactions/quotes/${quoteId}/save`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to unsave quote' };
    }
  }
};

export default postService;
