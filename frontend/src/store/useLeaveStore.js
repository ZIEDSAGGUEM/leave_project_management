import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';

const useLeaveStore = create((set) => ({
  leaveRequests: [],
  isLoading: false,
  error: null,

  // Fetch user's leave requests
  fetchUserLeaves: async (token) => {
    set({ isLoading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/leaves', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ leaveRequests: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching user leave requests:', error);
      toast.error('Erreur lors du chargement de vos demandes de congés');
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch all leave requests (admin)
  fetchAllLeaves: async (token) => {
    set({ isLoading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/leaves/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ leaveRequests: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Erreur lors du chargement des demandes de congés');
      set({ error: error.message, isLoading: false });
    }
  },

  // Submit new leave request
  submitLeaveRequest: async (leaveData, token) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        'http://localhost:5000/api/leaves',
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      set((state) => ({
        leaveRequests: [...state.leaveRequests, response.data],
        isLoading: false
      }));

      toast.success('Demande de congé soumise avec succès');
      return response.data;
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Erreur lors de la soumission de la demande');
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update leave request status
  updateLeaveStatus: async (id, status, token, reasonRefuse = null) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leaves/${id}`,
        { status, reasonRefuse },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        leaveRequests: state.leaveRequests.map((req) =>
          req._id === id
            ? {
                ...req,
                status: response.data.status,
                reasonRefuse: status === 'approved' ? null : reasonRefuse,
              }
            : req
        ),
      }));

      toast.success(
        status === 'approved'
          ? 'Demande approuvée avec succès'
          : status === 'rejected'
          ? 'Demande refusée avec succès'
          : 'Statut mis à jour avec succès'
      );

      return response.data;
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }
  },

  // Reset leave request status to pending
  resetLeaveStatus: async (id, token) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leaves/${id}`,
        { status: 'pending', reasonRefuse: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        leaveRequests: state.leaveRequests.map((req) =>
          req._id === id
            ? {
                ...req,
                status: response.data.status,
                reasonRefuse: null,
              }
            : req
        ),
      }));

      toast.success('Demande remise en attente');
      return response.data;
    } catch (error) {
      console.error('Error resetting leave status:', error);
      toast.error('Erreur lors de la réinitialisation du statut');
      throw error;
    }
  },
}));

export default useLeaveStore;
