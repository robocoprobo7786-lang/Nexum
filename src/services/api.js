import {
  mockDashboardStats,
  mockFaculty,
  mockPublications,
  mockPublicationsByYear,
  mockPublicationTypes
} from './mockData';

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let currentPublications = [...mockPublications];

export const api = {
  // Auth
  login: async (credentials) => {
    await delay(800);
    if (credentials.universityId && credentials.password) {
      return { token: 'mock-jwt-token', user: { name: 'Admin', role: 'admin' } };
    }
    throw new Error('Invalid credentials');
  },

  // Dashboard
  getDashboardStats: async () => {
    await delay(400);
    return mockDashboardStats;
  },

  // Faculty
  getFacultyList: async (filters = {}) => {
    await delay(600);
    let result = [...mockFaculty];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.department.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getFacultyProfile: async (id) => {
    await delay(500);
    const faculty = mockFaculty.find(f => f.id === id);
    if (!faculty) throw new Error('Faculty not found');
    return faculty;
  },

  // Publications
  getPublications: async (filters = {}) => {
    await delay(600);
    let result = [...currentPublications];
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.doi?.toLowerCase().includes(q) ||
        p.authors.some(a => a.name.toLowerCase().includes(q))
      );
    }
    
    if (filters.facultyId) {
      result = result.filter(p => p.authors.some(a => a.facultyId === filters.facultyId));
    }
    
    return result;
  },

  getPublicationById: async (id) => {
    await delay(400);
    const pub = currentPublications.find(p => p.id === id);
    if (!pub) throw new Error('Publication not found');
    return pub;
  },

  addPublication: async (publicationData) => {
    await delay(1000); // Simulate upload time
    const newPub = {
      ...publicationData,
      id: `p${Date.now()}`,
      citationCount: 0
    };
    currentPublications = [newPub, ...currentPublications];
    
    // Update stats for demo
    mockDashboardStats.totalPublications++;
    mockDashboardStats.thisYear++;
    
    return newPub;
  },

  // Reports
  getReportsData: async () => {
    await delay(500);
    return {
      publicationsByYear: mockPublicationsByYear,
      publicationTypes: mockPublicationTypes
    };
  }
};
