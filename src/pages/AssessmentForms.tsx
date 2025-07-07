import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, FileText, Settings } from 'lucide-react';

const AssessmentForms: React.FC = () => {
  const [activeTab, setActiveTab] = useState('forms');

  const assessmentForms = [
    {
      id: '1',
      title: 'Reading Comprehension Assessment',
      description: 'Evaluate reading skills and comprehension levels',
      category: 'Academic',
      fields: 12,
      createdDate: '2024-01-10',
      lastModified: '2024-01-15',
      status: 'active',
      usageCount: 45
    },
    {
      id: '2',
      title: 'Behavioral Observation Form',
      description: 'Track behavioral patterns and interventions',
      category: 'Behavioral',
      fields: 8,
      createdDate: '2024-01-05',
      lastModified: '2024-01-12',
      status: 'active',
      usageCount: 32
    },
    {
      id: '3',
      title: 'Speech Development Evaluation',
      description: 'Assess speech and language development',
      category: 'Speech',
      fields: 15,
      createdDate: '2023-12-20',
      lastModified: '2024-01-08',
      status: 'active',
      usageCount: 28
    },
    {
      id: '4',
      title: 'Motor Skills Assessment',
      description: 'Evaluate fine and gross motor skill development',
      category: 'Physical',
      fields: 10,
      createdDate: '2023-12-15',
      lastModified: '2024-01-01',
      status: 'draft',
      usageCount: 0
    }
  ];

  const formCategories = [
    { name: 'Academic', count: 8, color: 'bg-blue-100 text-blue-700' },
    { name: 'Behavioral', count: 5, color: 'bg-green-100 text-green-700' },
    { name: 'Speech', count: 6, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Physical', count: 4, color: 'bg-purple-100 text-purple-700' },
    { name: 'Social', count: 3, color: 'bg-pink-100 text-pink-700' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'text-blue-600 bg-blue-100';
      case 'Behavioral': return 'text-green-600 bg-green-100';
      case 'Speech': return 'text-yellow-600 bg-yellow-100';
      case 'Physical': return 'text-purple-600 bg-purple-100';
      case 'Social': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assessment Forms</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Form</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('forms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'forms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Forms
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'forms' && (
            <div className="space-y-4">
              {assessmentForms.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{form.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(form.category)}`}>
                          {form.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">{form.fields} fields</span>
                        <span className="text-sm text-gray-600">Used {form.usageCount} times</span>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        Created: {new Date(form.createdDate).toLocaleDateString()} • 
                        Last modified: {new Date(form.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formCategories.map((category) => (
                <div key={category.name} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{category.count} forms</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                      {category.count}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Manage Forms →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentForms;