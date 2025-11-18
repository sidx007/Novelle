import api from './api';

const profileService = {
  getCurrentProfile: async () => {
    try {
      const response = await api.get('/profile/me');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default profileService;
