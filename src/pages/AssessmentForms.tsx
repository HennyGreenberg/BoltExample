import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assessmentFormService, type AssessmentForm, type CategoryStats } from '../services/assessmentFormService';
import { Plus, Edit, Trash2, Copy, FileText, Settings, MoreVertical, Archive, Eye } from 'lucide-react';

const AssessmentForms: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('forms');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [forms, setForms] = useState<AssessmentForm[]>([]);
  const [formCategories, setFormCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load forms and categories on component mount
  useEffect(() => {
    loadForms();
    loadCategoryStats();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const formsData = await assessmentFormService.getAllForms();
      setForms(formsData);
      setError(null);
    } catch (err) {
      console.error('Error loading forms:', err);
      setError('Failed to load assessment forms');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryStats = async () => {
    try {
      const stats = await assessmentFormService.getCategoryStats();
      setFormCategories(stats);
    } catch (err) {
      console.error('Error loading category stats:', err);
    }
  };

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

  const handleEditForm = (formId: string) => {
    console.log('Edit form:', formId);
    // Navigate to edit form page
    alert(`Edit form functionality would navigate to /assessment-forms/edit/${formId}`);
    setShowActionsFor(null);
  };

  const handleCopyForm = (formId: string) => {
    if (!user) return;
    
    assessmentFormService.duplicateForm(formId, user.id)
      .then((duplicatedForm) => {
        setForms(prev => [duplicatedForm, ...prev]);
        console.log('Copied form:', duplicatedForm);
        alert('Form duplicated successfully!');
      })
      .catch((error) => {
        console.error('Error copying form:', error);
        alert('Error copying form. Please try again.');
      });
    setShowActionsFor(null);
  };

  const handleViewForm = (formId: string) => {
    // Increment usage count when viewing
    assessmentFormService.incrementUsage(formId)
      .then(() => {
        // Update local state
        setForms(prev => prev.map(form => 
          form._id === formId 
            ? { ...form, usageCount: form.usageCount + 1 }
            : form
        ));
      })
      .catch((error) => {
        console.error('Error updating usage count:', error);
      });
    
    console.log('View form:', formId);
    alert(`View form functionality would show preview of form ${formId}`);
    setShowActionsFor(null);
  };

  const handleArchiveForm = (formId: string) => {
    assessmentFormService.toggleArchiveForm(formId)
      .then((updatedForm) => {
        setForms(prev => prev.map(form => 
          form._id === formId ? updatedForm : form
        ));
        console.log('Toggled archive status for form:', formId);
      })
      .catch((error) => {
        console.error('Error archiving form:', error);
        alert('Error updating form status. Please try again.');
      });
    setShowActionsFor(null);
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      assessmentFormService.deleteForm(formId)
        .then(() => {
          setForms(prev => prev.filter(form => form._id !== formId));
          console.log('Deleted form:', formId);
          alert('Form deleted successfully!');
          // Reload category stats
          loadCategoryStats();
        })
        .catch((error) => {
          console.error('Error deleting form:', error);
          alert('Error deleting form. Please try again.');
        });
    }
    setShowActionsFor(null);
  };

  const handleFormSettings = (formId: string) => {
    console.log('Form settings:', formId);
    // Open settings modal or navigate to settings page
    alert(`Settings functionality would open configuration options for form ${formId}`);
    setShowActionsFor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assessment Forms</h1>
        <Link
          to="/assessment-forms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Form</span>
        </Link>
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
            <>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={loadForms}
                    className="mt-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {!loading && !error && forms.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assessment forms found</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first assessment form.</p>
                  <Link
                    to="/assessment-forms/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Form</span>
                  </Link>
                </div>
              )}
              
            <div className="space-y-4">
              {forms.map((form) => (
                <div key={form._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                        Created: {new Date(form.createdAt).toLocaleDateString()} • 
                        Last modified: {new Date(form.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleViewForm(form._id!)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Form"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditForm(form._id!)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Form"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleCopyForm(form._id!)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Copy Form"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionsFor(showActionsFor === form._id ? null : form._id!)}
                          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          title="More Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {showActionsFor === form._id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                            <button
                              onClick={() => handleFormSettings(form._id!)}
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Form Settings</span>
                            </button>
                            <button
                              onClick={() => handleArchiveForm(form._id!)}
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Archive className="h-4 w-4" />
                              <span>{form.status === 'archived' ? 'Unarchive' : 'Archive'}</span>
                            </button>
                            <hr className="my-2" />
                            <button
                              onClick={() => handleDeleteForm(form._id!)}
                              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Form</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
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