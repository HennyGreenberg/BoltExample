// Mock Assessment Form Service
// Provides mock data for UI/UX testing without backend dependency

import type { AssessmentForm, CategoryStats, AnswerOption, Question, Category } from './assessmentFormService';

// Mock data storage
let mockForms: AssessmentForm[] = [
  {
    _id: '1',
    title: 'Reading Comprehension Assessment',
    description: 'Comprehensive assessment for evaluating reading skills and comprehension levels in students with learning disabilities.',
    category: 'Academic',
    status: 'active',
    categories: [
      {
        id: 'cat1',
        name: 'Basic Reading Skills',
        description: 'Fundamental reading abilities',
        questions: [
          {
            id: 'q1',
            text: 'Can the student identify letters of the alphabet?',
            type: 'multiple_choice',
            options: [
              { id: 'opt1', text: 'Yes, all letters', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt2', text: 'Most letters', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt3', text: 'Some letters', hasSubQuestions: true, subQuestions: [
                {
                  id: 'sq1',
                  text: 'Which letters can the student identify?',
                  type: 'multiple_choice',
                  options: [
                    { id: 'sqopt1', text: 'Vowels only', hasSubQuestions: false, subQuestions: [] },
                    { id: 'sqopt2', text: 'Common consonants', hasSubQuestions: false, subQuestions: [] },
                    { id: 'sqopt3', text: 'First letters of name', hasSubQuestions: false, subQuestions: [] }
                  ]
                }
              ]},
              { id: 'opt4', text: 'No letters', hasSubQuestions: false, subQuestions: [] }
            ]
          },
          {
            id: 'q2',
            text: 'Can the student read simple words?',
            type: 'multiple_choice',
            options: [
              { id: 'opt5', text: 'Yes, fluently', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt6', text: 'With some difficulty', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt7', text: 'Only familiar words', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt8', text: 'Cannot read words', hasSubQuestions: false, subQuestions: [] }
            ]
          }
        ]
      },
      {
        id: 'cat2',
        name: 'Reading Comprehension',
        description: 'Understanding and interpreting text',
        questions: [
          {
            id: 'q3',
            text: 'Can the student understand the main idea of a short story?',
            type: 'multiple_choice',
            options: [
              { id: 'opt9', text: 'Always understands', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt10', text: 'Usually understands', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt11', text: 'Sometimes understands', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt12', text: 'Rarely understands', hasSubQuestions: false, subQuestions: [] }
            ]
          }
        ]
      }
    ],
    createdBy: '1',
    usageCount: 15,
    fields: 3,
    isActive: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    _id: '2',
    title: 'Behavioral Assessment Form',
    description: 'Assessment tool for evaluating behavioral patterns and social interactions in classroom settings.',
    category: 'Behavioral',
    status: 'active',
    categories: [
      {
        id: 'cat3',
        name: 'Classroom Behavior',
        description: 'Behavior in structured learning environment',
        questions: [
          {
            id: 'q4',
            text: 'How often does the student follow classroom rules?',
            type: 'multiple_choice',
            options: [
              { id: 'opt13', text: 'Always', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt14', text: 'Usually', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt15', text: 'Sometimes', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt16', text: 'Rarely', hasSubQuestions: false, subQuestions: [] }
            ]
          }
        ]
      }
    ],
    createdBy: '2',
    usageCount: 8,
    fields: 1,
    isActive: true,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    _id: '3',
    title: 'Speech Therapy Evaluation',
    description: 'Comprehensive speech and language assessment for identifying communication needs.',
    category: 'Speech',
    status: 'draft',
    categories: [
      {
        id: 'cat4',
        name: 'Articulation',
        description: 'Speech sound production',
        questions: [
          {
            id: 'q5',
            text: 'Can the student produce age-appropriate speech sounds?',
            type: 'multiple_choice',
            options: [
              { id: 'opt17', text: 'All sounds clear', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt18', text: 'Most sounds clear', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt19', text: 'Some difficulty', hasSubQuestions: false, subQuestions: [] },
              { id: 'opt20', text: 'Significant difficulty', hasSubQuestions: false, subQuestions: [] }
            ]
          }
        ]
      }
    ],
    createdBy: '3',
    usageCount: 2,
    fields: 1,
    isActive: true,
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-05T11:20:00Z'
  }
];

const mockCategoryStats: CategoryStats[] = [
  { name: 'Academic', count: 1, color: 'bg-blue-100 text-blue-700' },
  { name: 'Behavioral', count: 1, color: 'bg-green-100 text-green-700' },
  { name: 'Speech', count: 1, color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Physical', count: 0, color: 'bg-purple-100 text-purple-700' },
  { name: 'Social', count: 0, color: 'bg-pink-100 text-pink-700' }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate new ID
const generateId = () => Math.random().toString(36).substr(2, 9);

class MockAssessmentFormService {
  // Get all assessment forms
  async getAllForms(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<AssessmentForm[]> {
    await delay(500); // Simulate network delay
    
    let filteredForms = [...mockForms];

    if (filters?.status && filters.status !== 'all') {
      filteredForms = filteredForms.filter(form => form.status === filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      filteredForms = filteredForms.filter(form => form.category === filters.category);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredForms = filteredForms.filter(form => 
        form.title.toLowerCase().includes(searchLower) || 
        form.description.toLowerCase().includes(searchLower)
      );
    }

    return filteredForms;
  }

  // Get assessment form by ID
  async getFormById(id: string): Promise<AssessmentForm> {
    await delay(300);
    
    const form = mockForms.find(f => f._id === id);
    if (!form) {
      throw new Error('Assessment form not found');
    }
    
    return form;
  }

  // Create new assessment form
  async createForm(formData: Omit<AssessmentForm, '_id' | 'usageCount' | 'fields' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<AssessmentForm> {
    await delay(800); // Simulate longer delay for creation
    
    // Calculate fields count
    let fieldsCount = 0;
    formData.categories.forEach(category => {
      fieldsCount += category.questions.length;
      category.questions.forEach(question => {
        question.options.forEach(option => {
          if (option.hasSubQuestions) {
            fieldsCount += option.subQuestions.length;
          }
        });
      });
    });

    const newForm: AssessmentForm = {
      ...formData,
      _id: generateId(),
      usageCount: 0,
      fields: fieldsCount,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockForms.unshift(newForm); // Add to beginning of array
    
    // Update category stats
    const categoryIndex = mockCategoryStats.findIndex(cat => cat.name === newForm.category);
    if (categoryIndex !== -1) {
      mockCategoryStats[categoryIndex].count++;
    }

    return newForm;
  }

  // Update assessment form
  async updateForm(id: string, formData: Partial<AssessmentForm>): Promise<AssessmentForm> {
    await delay(600);
    
    const formIndex = mockForms.findIndex(f => f._id === id);
    if (formIndex === -1) {
      throw new Error('Assessment form not found');
    }

    const updatedForm = {
      ...mockForms[formIndex],
      ...formData,
      updatedAt: new Date().toISOString()
    };

    mockForms[formIndex] = updatedForm;
    return updatedForm;
  }

  // Delete assessment form
  async deleteForm(id: string): Promise<{ message: string }> {
    await delay(400);
    
    const formIndex = mockForms.findIndex(f => f._id === id);
    if (formIndex === -1) {
      throw new Error('Assessment form not found');
    }

    const deletedForm = mockForms[formIndex];
    mockForms.splice(formIndex, 1);

    // Update category stats
    const categoryIndex = mockCategoryStats.findIndex(cat => cat.name === deletedForm.category);
    if (categoryIndex !== -1 && mockCategoryStats[categoryIndex].count > 0) {
      mockCategoryStats[categoryIndex].count--;
    }

    return { message: 'Assessment form deleted successfully' };
  }

  // Archive/Unarchive assessment form
  async toggleArchiveForm(id: string): Promise<AssessmentForm> {
    await delay(400);
    
    const formIndex = mockForms.findIndex(f => f._id === id);
    if (formIndex === -1) {
      throw new Error('Assessment form not found');
    }

    const form = mockForms[formIndex];
    const newStatus = form.status === 'archived' ? 'active' : 'archived';
    
    const updatedForm = {
      ...form,
      status: newStatus as 'active' | 'archived',
      updatedAt: new Date().toISOString()
    };

    mockForms[formIndex] = updatedForm;
    return updatedForm;
  }

  // Duplicate assessment form
  async duplicateForm(id: string, createdBy: string): Promise<AssessmentForm> {
    await delay(700);
    
    const originalForm = mockForms.find(f => f._id === id);
    if (!originalForm) {
      throw new Error('Assessment form not found');
    }

    // Deep clone the form with new IDs
    const duplicatedCategories = originalForm.categories.map(cat => ({
      ...cat,
      id: generateId(),
      questions: cat.questions.map(q => ({
        ...q,
        id: generateId(),
        options: q.options.map(opt => ({
          ...opt,
          id: generateId(),
          subQuestions: opt.subQuestions.map(sq => ({
            ...sq,
            id: generateId(),
            options: sq.options.map(sqOpt => ({
              ...sqOpt,
              id: generateId()
            }))
          }))
        }))
      }))
    }));

    const duplicatedForm: AssessmentForm = {
      ...originalForm,
      _id: generateId(),
      title: `${originalForm.title} (Copy)`,
      categories: duplicatedCategories,
      createdBy,
      status: 'draft',
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockForms.unshift(duplicatedForm);

    // Update category stats
    const categoryIndex = mockCategoryStats.findIndex(cat => cat.name === duplicatedForm.category);
    if (categoryIndex !== -1) {
      mockCategoryStats[categoryIndex].count++;
    }

    return duplicatedForm;
  }

  // Increment usage count
  async incrementUsage(id: string): Promise<{ usageCount: number }> {
    await delay(200);
    
    const formIndex = mockForms.findIndex(f => f._id === id);
    if (formIndex === -1) {
      throw new Error('Assessment form not found');
    }

    mockForms[formIndex].usageCount++;
    mockForms[formIndex].updatedAt = new Date().toISOString();

    return { usageCount: mockForms[formIndex].usageCount };
  }

  // Get category statistics
  async getCategoryStats(): Promise<CategoryStats[]> {
    await delay(300);
    return [...mockCategoryStats];
  }
}

export const mockAssessmentFormService = new MockAssessmentFormService();