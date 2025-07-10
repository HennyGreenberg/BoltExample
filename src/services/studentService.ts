// Student Service
// Handles all API calls related to students

export interface Student {
  id: string;
  name: string;
  grade: string;
  age: number;
  dateOfBirth: string;
  primaryNeeds: string[];
  secondaryNeeds?: string[];
  enrollmentDate: string;
  lastAssessment?: string;
  progressTrend: 'improving' | 'stable' | 'needs_attention' | 'declining';
  image?: string;
  assignedTeachers: string[]; // User IDs
  assignedTherapists: string[]; // User IDs
  parentContact: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    notes?: string;
  };
  iepGoals: string[];
  accommodations: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  name: string;
  grade: string;
  age: number;
  dateOfBirth: string;
  primaryNeeds: string[];
  secondaryNeeds?: string[];
  enrollmentDate: string;
  assignedTeachers: string[];
  assignedTherapists: string[];
  parentContact: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    notes?: string;
  };
  iepGoals: string[];
  accommodations: string[];
}

// Check if we're in development mode and should use mock service
const USE_MOCK_SERVICE = import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class StudentService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/api/students${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all students (filtered by user role and assignments)
  async getAllStudents(filters?: {
    grade?: string;
    search?: string;
    assignedToUser?: string;
  }): Promise<Student[]> {
    const params = new URLSearchParams();
    
    if (filters?.grade) params.append('grade', filters.grade);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.assignedToUser) params.append('assignedToUser', filters.assignedToUser);

    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.request<Student[]>(endpoint);
  }

  // Get student by ID
  async getStudentById(id: string): Promise<Student> {
    return this.request<Student>(`/${id}`);
  }

  // Create new student
  async createStudent(studentData: CreateStudentData): Promise<Student> {
    return this.request<Student>('', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  // Update student
  async updateStudent(id: string, studentData: Partial<CreateStudentData>): Promise<Student> {
    return this.request<Student>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  // Delete student (soft delete)
  async deleteStudent(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Assign student to users
  async assignStudent(studentId: string, assignments: {
    teachers?: string[];
    therapists?: string[];
  }): Promise<Student> {
    return this.request<Student>(`/${studentId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(assignments),
    });
  }

  // Get available teachers and therapists for assignment
  async getAvailableStaff(): Promise<{
    teachers: Array<{ id: string; name: string; email: string; department?: string }>;
    therapists: Array<{ id: string; name: string; email: string; department?: string }>;
  }> {
    return this.request<{
      teachers: Array<{ id: string; name: string; email: string; department?: string }>;
      therapists: Array<{ id: string; name: string; email: string; department?: string }>;
    }>('/staff');
  }
}

// Service proxy that switches between mock and real service
class ServiceProxy {
  private realService = new StudentService();
  private mockService: any = null;
  
  private async getMockService() {
    if (!this.mockService) {
      const { mockStudentService } = await import('./mockStudentService');
      this.mockService = mockStudentService;
    }
    return this.mockService;
  }
  
  private async getService() {
    return USE_MOCK_SERVICE ? await this.getMockService() : this.realService;
  }
  
  async getAllStudents(filters?: { grade?: string; search?: string; assignedToUser?: string; }): Promise<Student[]> {
    const service = await this.getService();
    return service.getAllStudents(filters);
  }
  
  async getStudentById(id: string): Promise<Student> {
    const service = await this.getService();
    return service.getStudentById(id);
  }
  
  async createStudent(studentData: CreateStudentData): Promise<Student> {
    const service = await this.getService();
    return service.createStudent(studentData);
  }
  
  async updateStudent(id: string, studentData: Partial<CreateStudentData>): Promise<Student> {
    const service = await this.getService();
    return service.updateStudent(id, studentData);
  }
  
  async deleteStudent(id: string): Promise<{ message: string }> {
    const service = await this.getService();
    return service.deleteStudent(id);
  }
  
  async assignStudent(studentId: string, assignments: { teachers?: string[]; therapists?: string[]; }): Promise<Student> {
    const service = await this.getService();
    return service.assignStudent(studentId, assignments);
  }
  
  async getAvailableStaff(): Promise<{ teachers: Array<{ id: string; name: string; email: string; department?: string; }>; therapists: Array<{ id: string; name: string; email: string; department?: string; }>; }> {
    const service = await this.getService();
    return service.getAvailableStaff();
  }
}

export const studentService = new ServiceProxy();