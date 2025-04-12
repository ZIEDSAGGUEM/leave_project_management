
export const dummyUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, passwords would be hashed
    isAdmin: true,
    department: 'Direction',
    position: 'Directeur des Ressources Humaines',
    leaveBalance: {
      annual: 30,
      sick: 15,
      special: 7
    }
  },
  {
    id: '2',
    name: 'Standard User',
    email: 'user@example.com',
    password: 'user123',
    isAdmin: false,
    department: 'Marketing',
    position: 'Chef de Projet',
    leaveBalance: {
      annual: 25,
      sick: 12,
      special: 5
    }
  },
  {
    id: '3',
    name: 'Sarah Martin',
    email: 'sarah@example.com',
    password: 'sarah123',
    isAdmin: false,
    department: 'IT',
    position: 'Développeur Frontend',
    leaveBalance: {
      annual: 22,
      sick: 10,
      special: 3
    }
  },
  {
    id: '4',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    password: 'jean123',
    isAdmin: false,
    department: 'Finances',
    position: 'Comptable',
    leaveBalance: {
      annual: 24,
      sick: 12,
      special: 4
    }
  }
];

export const dummyLeaveRequests = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'Standard User',
    type: 'annual',
    startDate: '2023-08-01',
    endDate: '2023-08-10',
    reason: 'Vacances d\'été',
    status: 'approved',
    createdAt: '2023-07-15'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Standard User',
    type: 'sick',
    startDate: '2023-09-05',
    endDate: '2023-09-06',
    reason: 'Maladie',
    status: 'approved',
    createdAt: '2023-09-05'
  },
  {
    id: '3',
    employeeId: '2',
    employeeName: 'Standard User',
    type: 'special',
    startDate: '2023-10-20',
    endDate: '2023-10-20',
    reason: 'Rendez-vous médical',
    status: 'pending',
    createdAt: '2023-10-15'
  },
  {
    id: '4',
    employeeId: '3',
    employeeName: 'Sarah Martin',
    type: 'annual',
    startDate: '2023-11-15',
    endDate: '2023-11-22',
    reason: 'Vacances',
    status: 'pending',
    createdAt: '2023-10-30'
  },
  {
    id: '5',
    employeeId: '4',
    employeeName: 'Jean Dupont',
    type: 'sick',
    startDate: '2023-10-25',
    endDate: '2023-10-26',
    reason: 'Arrêt maladie',
    status: 'rejected',
    createdAt: '2023-10-24'
  },
  {
    id: '6',
    employeeId: '3',
    employeeName: 'Sarah Martin',
    type: 'special',
    startDate: '2023-07-10',
    endDate: '2023-07-12',
    reason: 'Événement familial',
    status: 'approved',
    createdAt: '2023-07-01'
  }
];

// Helper functions
export const findUserById = (id) => {
  return dummyUsers.find(user => user.id === id);
};

export const findUserByEmail = (email) => {
  return dummyUsers.find(user => user.email === email);
};

export const getLeaveRequestsByUserId = (userId) => {
  return dummyLeaveRequests.filter(request => request.employeeId === userId);
};

export const getLeaveRequestById = (id) => {
  return dummyLeaveRequests.find(request => request.id === id);
};

// Leave type labels
export const leaveTypeLabels = {
  annual: 'Congé annuel',
  sick: 'Congé maladie',
  special: 'Congé exceptionnel',
  other: 'Autre congé'
};

// Status labels
export const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Refusé'
};
