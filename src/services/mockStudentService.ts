// Mock Student Service
// Provides mock data for student management without backend dependency

import type { Student, CreateStudentData } from './studentService';

// Mock data storage
let mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    grade: 'Grade 3',
    age: 9,
    dateOfBirth: '2014-03-15',
    primaryNeeds: ['Learning Disability', 'ADHD'],
    secondaryNeeds: ['Anxiety'],
    enrollmentDate: '2023-09-01',
    lastAssessment: '2024-01-15',
    progressTrend: 'improving',
    image: 'https://images.pexels.com/photos/3663611/pexels-photo-3663611.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignedTeachers: ['2'], // Ms. Emily Johnson
    assignedTherapists: ['4'], // Ms. Jennifer Davis
    parentContact: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      relationship: 'Mother'
    },
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 987-6543',
      relationship: 'Father'
    },
    medicalInfo: {
      allergies: ['Peanuts', 'Shellfish'],
      medications: ['Ritalin 10mg'],
      conditions: ['ADHD', 'Mild Anxiety'],
      notes: 'Requires quiet environment for testing'
    },
    iepGoals: [
      'Improve reading comprehension by 20%',
      'Increase attention span during lessons',
      'Develop better social interaction skills'
    ],
    accommodations: [
      'Extended time for tests',
      'Preferential seating',
      'Frequent breaks'
    ],
    isActive: true,
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    grade: 'Grade 5',
    age: 11,
    dateOfBirth: '2012-07-22',
    primaryNeeds: ['Autism Spectrum', 'Speech Delay'],
    enrollmentDate: '2023-09-01',
    lastAssessment: '2024-01-14',
    progressTrend: 'stable',
    image: 'https://images.pexels.com/photos/3766228/pexels-photo-3766228.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignedTeachers: ['2'], // Ms. Emily Johnson
    assignedTherapists: ['4', '5'], // Ms. Jennifer Davis, Dr. Michael Brown
    parentContact: {
      name: 'Lisa Chen',
      phone: '(555) 234-5678',
      email: 'lisa.chen@email.com',
      relationship: 'Mother'
    },
    emergencyContact: {
      name: 'David Chen',
      phone: '(555) 876-5432',
      relationship: 'Father'
    },
    medicalInfo: {
      allergies: [],
      medications: [],
      conditions: ['Autism Spectrum Disorder'],
      notes: 'Responds well to visual schedules and routine'
    },
    iepGoals: [
      'Improve verbal communication skills',
      'Increase social interaction with peers',
      'Develop independent work habits'
    ],
    accommodations: [
      'Visual schedule',
      'Sensory breaks',
      'Modified assignments'
    ],
    isActive: true,
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    grade: 'Grade 2',
    age: 8,
    dateOfBirth: '2015-11-08',
    primaryNeeds: ['Behavioral Issues'],
    secondaryNeeds: ['Emotional Regulation'],
    enrollmentDate: '2023-09-01',
    lastAssessment: '2024-01-13',
    progressTrend: 'improving',
    image: 'https://images.pexels.com/photos/3663611/pexels-photo-3663611.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignedTeachers: ['3'], // Mr. Robert Smith
    assignedTherapists: ['4'], // Ms. Jennifer Davis
    parentContact: {
      name: 'Amanda Williams',
      phone: '(555) 345-6789',
      email: 'amanda.williams@email.com',
      relationship: 'Mother'
    },
    emergencyContact: {
      name: 'James Williams',
      phone: '(555) 765-4321',
      relationship: 'Father'
    },
    medicalInfo: {
      allergies: ['Latex'],
      medications: [],
      conditions: ['Oppositional Defiant Disorder'],
      notes: 'Benefits from positive reinforcement strategies'
    },
    iepGoals: [
      'Improve emotional regulation skills',
      'Reduce disruptive behaviors',
      'Increase compliance with classroom rules'
    ],
    accommodations: [
      'Behavior intervention plan',
      'Cool-down space',
      'Positive reinforcement system'
    ],
    isActive: true,
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-01-13T12:20:00Z'
  },
  {
    id: '4',
    name: 'David Martinez',
    grade: 'Grade 4',
    age: 10,
    dateOfBirth: '2013-05-30',
    primaryNeeds: ['Dyslexia', 'Anxiety'],
    enrollmentDate: '2023-09-01',
    lastAssessment: '2024-01-12',
    progressTrend: 'needs_attention',
    image: 'https://images.pexels.com/photos/3766228/pexels-photo-3766228.jpeg?auto=compress&cs=tinysrgb&w=150',
    assignedTeachers: ['3'], // Mr. Robert Smith
    assignedTherapists: [],
    parentContact: {
      name: 'Maria Martinez',
      phone: '(555) 456-7890',
      email: 'maria.martinez@email.com',
      relationship: 'Mother'
    },
    emergencyContact: {
      name: 'Carlos Martinez',
      phone: '(555) 654-3210',
      relationship: 'Father'
    },
    medicalInfo: {
      allergies: [],
      medications: ['Anxiety medication as needed'],
      conditions: ['Dyslexia', 'Generalized Anxiety Disorder'],
      notes: 'Requires additional support with reading tasks'
    },
    iepGoals: [
      'Improve reading fluency and comprehension',
      'Develop coping strategies for anxiety',
      'Increase confidence in academic tasks'
    ],
    accommodations: [
      'Text-to-speech software',
      'Extended time for reading tasks',
      'Anxiety management strategies'
    ],
    isActive: true,
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-01-12T10:15:00Z'
  }
];

const mockStaff = {
  teachers: [
    { id: '2', name: 'Ms. Emily Johnson', email: 'emily.johnson@school.com', department: 'Special Education' },
    { id: '3', name: 'Mr. Robert Smith', email: 'robert.smith@school.com', department: 'Mathematics' },
    { id: '6', name: 'Ms. Lisa Anderson', email: 'lisa.anderson@school.com', department: 'Language Arts' },
    { id: '7', name: 'Mr. James Wilson', email: 'james.wilson@school.com', department: 'Science' }
  ],
  therapists: [
    { id: '4', name: 'Ms. Jennifer Davis', email: 'jennifer.davis@school.com', department: 'Speech Therapy' },
    { id: '5', name: 'Dr. Michael Brown', email: 'michael.brown@school.com', department: 'Occupational Therapy' },
    { id: '8', name: 'Dr. Susan Taylor', email: 'susan.taylor@school.com', department: 'Physical Therapy' },
    { id: '9', name: 'Ms. Rachel Green', email: 'rachel.green@school.com', department: 'Behavioral Therapy' }
  ]
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate new ID
const generateId = () => Math.random().toString(36).substr(2, 9);

class MockStudentService {
  // Get all students (filtered by user role and assignments)
  async getAllStudents(filters?: {
    grade?: string;
    search?: string;
    assignedToUser?: string;
  }): Promise<Student[]> {
    await delay(500);
    
    let filteredStudents = [...mockStudents];

    // Filter by assigned user (for teachers and therapists)
    if (filters?.assignedToUser) {
      filteredStudents = filteredStudents.filter(student => 
        student.assignedTeachers.includes(filters.assignedToUser!) ||
        student.assignedTherapists.includes(filters.assignedToUser!)
      );
    }

    // Filter by grade
    if (filters?.grade && filters.grade !== 'all') {
      filteredStudents = filteredStudents.filter(student => student.grade === filters.grade);
    }

    // Filter by search term
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(searchLower) ||
        student.primaryNeeds.some(need => need.toLowerCase().includes(searchLower)) ||
        student.grade.toLowerCase().includes(searchLower)
      );
    }

    return filteredStudents;
  }

  // Get student by ID
  async getStudentById(id: string): Promise<Student> {
    await delay(300);
    
    const student = mockStudents.find(s => s.id === id);
    if (!student) {
      throw new Error('Student not found');
    }
    
    return student;
  }

  // Create new student
  async createStudent(studentData: CreateStudentData): Promise<Student> {
    await delay(800);
    
    const newStudent: Student = {
      ...studentData,
      id: generateId(),
      progressTrend: 'stable',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockStudents.unshift(newStudent);
    return newStudent;
  }

  // Update student
  async updateStudent(id: string, studentData: Partial<CreateStudentData>): Promise<Student> {
    await delay(600);
    
    const studentIndex = mockStudents.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    const updatedStudent = {
      ...mockStudents[studentIndex],
      ...studentData,
      updatedAt: new Date().toISOString()
    };

    mockStudents[studentIndex] = updatedStudent;
    return updatedStudent;
  }

  // Delete student (soft delete)
  async deleteStudent(id: string): Promise<{ message: string }> {
    await delay(400);
    
    const studentIndex = mockStudents.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    mockStudents[studentIndex].isActive = false;
    mockStudents[studentIndex].updatedAt = new Date().toISOString();

    return { message: 'Student deleted successfully' };
  }

  // Assign student to users
  async assignStudent(studentId: string, assignments: {
    teachers?: string[];
    therapists?: string[];
  }): Promise<Student> {
    await delay(400);
    
    const studentIndex = mockStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    const updatedStudent = {
      ...mockStudents[studentIndex],
      ...(assignments.teachers && { assignedTeachers: assignments.teachers }),
      ...(assignments.therapists && { assignedTherapists: assignments.therapists }),
      updatedAt: new Date().toISOString()
    };

    mockStudents[studentIndex] = updatedStudent;
    return updatedStudent;
  }

  // Get available teachers and therapists for assignment
  async getAvailableStaff(): Promise<{
    teachers: Array<{ id: string; name: string; email: string; department?: string }>;
    therapists: Array<{ id: string; name: string; email: string; department?: string }>;
  }> {
    await delay(300);
    return mockStaff;
  }
}

export const mockStudentService = new MockStudentService();