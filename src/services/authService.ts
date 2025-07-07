// Mock authentication service
// In a real application, this would make HTTP requests to your backend

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'therapist';
  assignedStudents?: string[];
}

interface LoginResponse {
  user: User;
  token: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@school.com',
    name: 'Dr. Sarah Wilson',
    role: 'admin'
  },
  {
    id: '2',
    email: 'teacher@school.com',
    name: 'Ms. Emily Johnson',
    role: 'teacher',
    assignedStudents: ['1', '2']
  },
  {
    id: '3',
    email: 'therapist@school.com',
    name: 'Ms. Jennifer Davis',
    role: 'therapist',
    assignedStudents: ['1', '3']
  }
];

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In a real app, you would validate the password here
    if (
      (email === 'admin@school.com' && password === 'admin123') ||
      (email === 'teacher@school.com' && password === 'teacher123') ||
      (email === 'therapist@school.com' && password === 'therapist123')
    ) {
      const token = `mock-jwt-token-${user.id}`;
      return { user, token };
    }

    throw new Error('Invalid credentials');
  },

  verifyToken: async (token: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract user ID from mock token
    const userId = token.split('-').pop();
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      throw new Error('Invalid token');
    }

    return user;
  }
};