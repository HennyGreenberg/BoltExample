// Assessment Form Service
// Handles all API calls related to assessment forms

export interface AnswerOption {
  id: string;
  text: string;
  hasSubQuestions: boolean;
  subQuestions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice';
  options: AnswerOption[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface AssessmentForm {
  _id?: string;
  title: string;
  description: string;
  category: 'Academic' | 'Behavioral' | 'Speech' | 'Physical' | 'Social';
  status: 'draft' | 'active' | 'archived';
  categories: Category[];
  createdBy: string;
  usageCount: number;
  fields: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  color: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AssessmentFormService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/api/assessment-forms${endpoint}`;
    
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

  // Get all assessment forms
  async getAllForms(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<AssessmentForm[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.request<AssessmentForm[]>(endpoint);
  }

  // Get assessment form by ID
  async getFormById(id: string): Promise<AssessmentForm> {
    return this.request<AssessmentForm>(`/${id}`);
  }

  // Create new assessment form
  async createForm(formData: Omit<AssessmentForm, '_id' | 'usageCount' | 'fields' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<AssessmentForm> {
    return this.request<AssessmentForm>('', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Update assessment form
  async updateForm(id: string, formData: Partial<AssessmentForm>): Promise<AssessmentForm> {
    return this.request<AssessmentForm>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  // Delete assessment form
  async deleteForm(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Archive/Unarchive assessment form
  async toggleArchiveForm(id: string): Promise<AssessmentForm> {
    return this.request<AssessmentForm>(`/${id}/archive`, {
      method: 'PATCH',
    });
  }

  // Duplicate assessment form
  async duplicateForm(id: string, createdBy: string): Promise<AssessmentForm> {
    return this.request<AssessmentForm>(`/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ createdBy }),
    });
  }

  // Increment usage count
  async incrementUsage(id: string): Promise<{ usageCount: number }> {
    return this.request<{ usageCount: number }>(`/${id}/use`, {
      method: 'PATCH',
    });
  }

  // Get category statistics
  async getCategoryStats(): Promise<CategoryStats[]> {
    return this.request<CategoryStats[]>('/stats/categories');
  }
}

export const assessmentFormService = new AssessmentFormService();