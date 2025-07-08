import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  Save, 
  Send,
  GripVertical,
  AlertCircle,
  FileText,
  FolderPlus,
  HelpCircle,
  Edit,
  Copy,
  Settings,
  ArrowLeft
} from 'lucide-react';

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  hasSubQuestions: boolean;
  subQuestions: Question[];
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice';
  options: AnswerOption[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface AssessmentForm {
  title: string;
  description: string;
  categories: Category[];
}

interface ValidationError {
  field: string;
  message: string;
  categoryId?: string;
  questionId?: string;
  optionId?: string;
}

const AssessmentFormBuilder: React.FC = () => {
  const [form, setForm] = useState<AssessmentForm>({
    title: '',
    description: '',
    categories: []
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Form manipulation functions
  const updateForm = (updates: Partial<AssessmentForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
    clearErrors();
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: generateId(),
      name: '',
      description: '',
      questions: []
    };
    setForm(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    }));
    clearErrors();
  };

  const deleteCategory = (categoryId: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    setForm(prev => {
      const categories = [...prev.categories];
      const index = categories.findIndex(cat => cat.id === categoryId);
      if (
        (direction === 'up' && index > 0) ||
        (direction === 'down' && index < categories.length - 1)
      ) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [categories[index], categories[newIndex]] = [categories[newIndex], categories[index]];
      }
      return { ...prev, categories };
    });
  };

  const addQuestion = (categoryId: string) => {
    const newQuestion: Question = {
      id: generateId(),
      text: '',
      type: 'multiple_choice',
      options: [
        { id: generateId(), text: '', isCorrect: false, hasSubQuestions: false, subQuestions: [] },
        { id: generateId(), text: '', isCorrect: false, hasSubQuestions: false, subQuestions: [] }
      ]
    };

    updateCategory(categoryId, {
      questions: [
        ...form.categories.find(cat => cat.id === categoryId)?.questions || [],
        newQuestion
      ]
    });
  };

  const updateQuestion = (categoryId: string, questionId: string, updates: Partial<Question>) => {
    const category = form.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const updatedQuestions = category.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    updateCategory(categoryId, { questions: updatedQuestions });
  };

  const deleteQuestion = (categoryId: string, questionId: string) => {
    const category = form.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const updatedQuestions = category.questions.filter(q => q.id !== questionId);
    updateCategory(categoryId, { questions: updatedQuestions });
  };

  const addOption = (categoryId: string, questionId: string) => {
    const category = form.categories.find(cat => cat.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOption: AnswerOption = {
      id: generateId(),
      text: '',
      isCorrect: false,
      hasSubQuestions: false,
      subQuestions: []
    };

    updateQuestion(categoryId, questionId, {
      options: [...question.options, newOption]
    });
  };

  const updateOption = (
    categoryId: string, 
    questionId: string, 
    optionId: string, 
    updates: Partial<AnswerOption>
  ) => {
    const category = form.categories.find(cat => cat.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);
    if (!question) return;

    const updatedOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );

    updateQuestion(categoryId, questionId, { options: updatedOptions });
  };

  const deleteOption = (categoryId: string, questionId: string, optionId: string) => {
    const category = form.categories.find(cat => cat.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);
    if (!question || question.options.length <= 2) return;

    const updatedOptions = question.options.filter(opt => opt.id !== optionId);
    updateQuestion(categoryId, questionId, { options: updatedOptions });
  };

  const addSubQuestion = (categoryId: string, questionId: string, optionId: string) => {
    const category = form.categories.find(cat => cat.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);
    const option = question?.options.find(opt => opt.id === optionId);
    if (!option) return;

    const newSubQuestion: Question = {
      id: generateId(),
      text: '',
      type: 'multiple_choice',
      options: [
        { id: generateId(), text: '', isCorrect: false, hasSubQuestions: false, subQuestions: [] },
        { id: generateId(), text: '', isCorrect: false, hasSubQuestions: false, subQuestions: [] }
      ]
    };

    updateOption(categoryId, questionId, optionId, {
      hasSubQuestions: true,
      subQuestions: [...option.subQuestions, newSubQuestion]
    });
  };

  // Validation
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!form.title.trim()) {
      errors.push({ field: 'title', message: 'Form title is required' });
    }

    if (!form.description.trim()) {
      errors.push({ field: 'description', message: 'Form description is required' });
    }

    if (form.categories.length === 0) {
      errors.push({ field: 'categories', message: 'At least one category is required' });
    }

    form.categories.forEach(category => {
      if (!category.name.trim()) {
        errors.push({
          field: 'categoryName',
          message: 'Category name is required',
          categoryId: category.id
        });
      }

      if (category.questions.length === 0) {
        errors.push({
          field: 'categoryQuestions',
          message: 'Each category must have at least one question',
          categoryId: category.id
        });
      }

      category.questions.forEach(question => {
        if (!question.text.trim()) {
          errors.push({
            field: 'questionText',
            message: 'Question text is required',
            categoryId: category.id,
            questionId: question.id
          });
        }

        if (question.options.length < 2) {
          errors.push({
            field: 'questionOptions',
            message: 'Each question must have at least 2 answer options',
            categoryId: category.id,
            questionId: question.id
          });
        }

        question.options.forEach(option => {
          if (!option.text.trim()) {
            errors.push({
              field: 'optionText',
              message: 'Answer option text is required',
              categoryId: category.id,
              questionId: question.id,
              optionId: option.id
            });
          }
        });
      });
    });

    return errors;
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    // Here you would save to backend
    console.log('Saving draft:', form);
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsDraft(false);
    // Here you would submit to backend
    console.log('Submitting form:', form);
    // After successful submission, you might redirect back to the forms list
  };

  const handleEdit = () => {
    // Edit functionality - could open in edit mode or navigate to edit page
    console.log('Edit form:', form);
  };

  const handleCopy = () => {
    // Copy/duplicate form functionality
    const copiedForm = {
      ...form,
      title: `${form.title} (Copy)`,
      categories: form.categories.map(cat => ({
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
      }))
    };
    setForm(copiedForm);
    console.log('Copied form:', copiedForm);
  };

  const handleSettings = () => {
    // Settings functionality - could open a settings modal
    setShowActions(!showActions);
    console.log('Form settings:', form);
  };

  const handleDelete = () => {
    // Delete functionality - would typically show confirmation dialog
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      console.log('Delete form:', form);
      // Here you would delete from backend and redirect
    }
  };

  const getErrorsForField = (field: string, categoryId?: string, questionId?: string, optionId?: string) => {
    return errors.filter(error => 
      error.field === field &&
      error.categoryId === categoryId &&
      error.questionId === questionId &&
      error.optionId === optionId
    );
  };

  const renderSubQuestions = (
    subQuestions: Question[],
    categoryId: string,
    parentQuestionId: string,
    optionId: string,
    depth: number = 1
  ) => {
    return (
      <div className={`ml-${depth * 6} mt-4 space-y-4 border-l-2 border-gray-200 pl-4`}>
        {subQuestions.map((subQuestion, index) => (
          <div key={subQuestion.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <HelpCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sub-question {index + 1}</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Enter sub-question text..."
                  value={subQuestion.text}
                  onChange={(e) => {
                    const updatedSubQuestions = subQuestions.map(sq =>
                      sq.id === subQuestion.id ? { ...sq, text: e.target.value } : sq
                    );
                    updateOption(categoryId, parentQuestionId, optionId, {
                      subQuestions: updatedSubQuestions
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                {subQuestion.options.map((option, optIndex) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option.text}
                      onChange={(e) => {
                        const updatedSubQuestions = subQuestions.map(sq =>
                          sq.id === subQuestion.id
                            ? {
                                ...sq,
                                options: sq.options.map(opt =>
                                  opt.id === option.id ? { ...opt, text: e.target.value } : opt
                                )
                              }
                            : sq
                        );
                        updateOption(categoryId, parentQuestionId, optionId, {
                          subQuestions: updatedSubQuestions
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Form Preview</h1>
            {form.title && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {form.title}
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Duplicate Form"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Back to Editor</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{form.title || 'Untitled Form'}</h2>
            <p className="text-gray-600 text-lg">{form.description || 'No description provided'}</p>
          </div>

          {form.categories.map((category, categoryIndex) => (
            <div key={category.id} className="mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {categoryIndex + 1}. {category.name || 'Untitled Category'}
                </h3>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </div>

              {category.questions.map((question, questionIndex) => (
                <div key={question.id} className="mb-6 bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {categoryIndex + 1}.{questionIndex + 1} {question.text || 'Untitled Question'}
                  </h4>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id}>
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            className="text-blue-600 focus:ring-blue-500"
                            disabled
                          />
                          <span className="flex-1">{option.text || `Option ${optionIndex + 1}`}</span>
                        </label>
                        
                        {option.hasSubQuestions && option.subQuestions.length > 0 && (
                          <div className="ml-8 mt-2">
                            {renderSubQuestions(option.subQuestions, category.id, question.id, option.id)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Form Builder</h1>
        </div>
        <div className="flex space-x-3">
          {/* Form Actions */}
          <div className="relative">
            <button
              onClick={handleSettings}
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              title="Form Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Form</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Duplicate Form</span>
                </button>
                <hr className="my-2" />
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Form</span>
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Form</span>
          </button>
        </div>
      </div>

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Form Details</h2>
              <p className="text-sm text-gray-600">Configure your assessment form</p>
            </div>
          </div>
          
          {form.title && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isDraft ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100'
              }`}>
                {isDraft ? 'Draft' : 'Active'}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title *
            </label>
            <input
              type="text"
              placeholder="Enter assessment form title..."
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                getErrorsForField('title').length > 0 ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {getErrorsForField('title').map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description/Purpose *
            </label>
            <textarea
              placeholder="Describe the purpose and scope of this assessment..."
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                getErrorsForField('description').length > 0 ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {getErrorsForField('description').map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {form.categories.map((category, categoryIndex) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Category Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <FolderPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Category {categoryIndex + 1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveCategory(category.id, 'up')}
                    disabled={categoryIndex === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveCategory(category.id, 'down')}
                    disabled={categoryIndex === form.categories.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category name..."
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      getErrorsForField('categoryName', category.id).length > 0 ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getErrorsForField('categoryName', category.id).map((error, index) => (
                    <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Description
                  </label>
                  <input
                    type="text"
                    placeholder="Optional description..."
                    value={category.description}
                    onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((question, questionIndex) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700">Question {questionIndex + 1}</span>
                      </div>
                      <button
                        onClick={() => deleteQuestion(category.id, question.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your question..."
                          value={question.text}
                          onChange={(e) => updateQuestion(category.id, question.id, { text: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            getErrorsForField('questionText', category.id, question.id).length > 0 ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {getErrorsForField('questionText', category.id, question.id).map((error, index) => (
                          <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Answer Options *
                          </label>
                          <button
                            onClick={() => addOption(category.id, question.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Option</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={option.id} className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500 w-8">{optionIndex + 1}.</span>
                                <input
                                  type="text"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={option.text}
                                  onChange={(e) => updateOption(category.id, question.id, option.id, { text: e.target.value })}
                                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    getErrorsForField('optionText', category.id, question.id, option.id).length > 0 ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                />
                                <button
                                  onClick={() => addSubQuestion(category.id, question.id, option.id)}
                                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  + Sub-question
                                </button>
                                {question.options.length > 2 && (
                                  <button
                                    onClick={() => deleteOption(category.id, question.id, option.id)}
                                    className="p-1 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                              
                              {getErrorsForField('optionText', category.id, question.id, option.id).map((error, index) => (
                                <p key={index} className="ml-11 text-sm text-red-600">{error.message}</p>
                              ))}

                              {option.hasSubQuestions && option.subQuestions.length > 0 && (
                                renderSubQuestions(option.subQuestions, category.id, question.id, option.id)
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {getErrorsForField('questionOptions', category.id, question.id).map((error, index) => (
                          <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {getErrorsForField('categoryQuestions', category.id).map((error, index) => (
                  <p key={index} className="text-sm text-red-600">{error.message}</p>
                ))}

                <button
                  onClick={() => addQuestion(category.id)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {getErrorsForField('categories').map((error, index) => (
          <p key={index} className="text-sm text-red-600">{error.message}</p>
        ))}

        <button
          onClick={addCategory}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <FolderPlus className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>
    </div>
  );
};

export default AssessmentFormBuilder;