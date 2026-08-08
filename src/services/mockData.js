export const mockDashboardStats = {
  totalPublications: 128,
  faculty: 42,
  thisYear: 31,
  departments: 8
};

export const mockFaculty = [
  {
    id: "f1",
    name: "Dr. Anil Kumar",
    department: "Information Science",
    designation: "Professor",
    email: "anil.kumar@university.edu",
    publicationsCount: 14,
    contributionsCount: 5,
  },
  {
    id: "f2",
    name: "Dr. Priya Sharma",
    department: "Computer Science",
    designation: "Associate Professor",
    email: "priya.sharma@university.edu",
    publicationsCount: 22,
    contributionsCount: 8,
  },
  {
    id: "f3",
    name: "Dr. Rajesh Singh",
    department: "Electronics",
    designation: "Assistant Professor",
    email: "rajesh.singh@university.edu",
    publicationsCount: 6,
    contributionsCount: 2,
  },
  {
    id: "f4",
    name: "Dr. Sunita Reddy",
    department: "Information Science",
    designation: "Professor",
    email: "sunita.reddy@university.edu",
    publicationsCount: 31,
    contributionsCount: 12,
  }
];

export const mockPublications = [
  {
    id: "p1",
    title: "AI-Based Smart Hall Allocation System",
    type: "Journal Article",
    journal: "International Journal of AI",
    year: 2026,
    doi: "10.1234/ijai.2026.001",
    citationCount: 4,
    evidenceFile: "publication_certificate.pdf",
    authors: [
      { id: "a1", name: "Dr. Anil Kumar", type: "Internal Faculty", facultyId: "f1" },
      { id: "a2", name: "Dr. Priya Sharma", type: "Internal Faculty", facultyId: "f2" },
      { id: "a3", name: "Rahul Mehta", type: "External Author", institution: "Tech Corp" }
    ]
  },
  {
    id: "p2",
    title: "Machine Learning Approaches in Healthcare Data Analysis",
    type: "Conference Paper",
    journal: "IEEE International Conference on Data Science",
    year: 2025,
    doi: "10.1109/icds.2025.042",
    citationCount: 12,
    evidenceFile: "ml_healthcare_presentation.pdf",
    authors: [
      { id: "a4", name: "Dr. Sunita Reddy", type: "Internal Faculty", facultyId: "f4" },
      { id: "a1", name: "Dr. Anil Kumar", type: "Internal Faculty", facultyId: "f1" }
    ]
  },
  {
    id: "p3",
    title: "Evaluating Blockchain for Academic Credential Verification",
    type: "Journal Article",
    journal: "Journal of Educational Technology Systems",
    year: 2026,
    doi: "10.5678/jets.2026.089",
    citationCount: 0,
    evidenceFile: "blockchain_edu_draft.pdf",
    authors: [
      { id: "a2", name: "Dr. Priya Sharma", type: "Internal Faculty", facultyId: "f2" },
      { id: "a5", name: "Dr. Vikram Das", type: "External Author", institution: "National Institute" }
    ]
  }
];

export const mockPublicationsByYear = [
  { year: "2022", count: 18 },
  { year: "2023", count: 24 },
  { year: "2024", count: 32 },
  { year: "2025", count: 41 },
  { year: "2026", count: 31 },
];

export const mockPublicationTypes = [
  { name: "Journal Article", value: 65 },
  { name: "Conference Paper", value: 45 },
  { name: "Book Chapter", value: 12 },
  { name: "Patent", value: 6 },
];
