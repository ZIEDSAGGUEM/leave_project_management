import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        isAdmin: response.data.isAdmin,
        leaveBalance: response.data.leaveBalance,
        notifications: response.data.notifications,
        token: response.data.token,
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      set({ 
        user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur de connexion',
        isLoading: false 
      });
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem("currentUser");
    set({ 
      user: null,
      isAuthenticated: false,
      error: null 
    });
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/users', userData);
      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        isAdmin: response.data.isAdmin,
        leaveBalance: response.data.leaveBalance,
        notifications: response.data.notifications,
        token: response.data.token,
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      set({ 
        user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur d\'inscription',
        isLoading: false 
      });
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    }
  },

  // Clear errors
  clearErrors: () => set({ error: null })
}));

export default useUserStore;
