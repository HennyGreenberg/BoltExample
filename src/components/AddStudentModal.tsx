import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Phone, Mail, Heart, AlertTriangle, Target, Settings } from 'lucide-react';
import { studentService, type CreateStudentData } from '../services/studentService';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (student: any) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onStudentAdded }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableStaff, setAvailableStaff] = useState<{
    teachers: Array<{ id: string; name: string; email: string; department?: string }>;
    therapists: Array<{ id: string; name: string; email: string; department?: string }>;
  }>({ teachers: [], therapists: [] });

  const [formData, setFormData] = useState<CreateStudentData>({
    name: '',
    grade: '',
    age: 0,
    dateOfBirth: '',
    primaryNeeds: [],
    secondaryNeeds: [],
    enrollmentDate: new Date().toISOString().split('T')[0],
    assignedTeachers: [],
    assignedTherapists: [],
    parentContact: {
      name: '',
      phone: '',
      email: '',
      relationship: 'Mother'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: 'Father'
    },
    medicalInfo: {
      allergies: [],
      medications: [],
      conditions: [],
      notes: ''
    },
    iepGoals: [''],
    accommodations: ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsOptions = [
    'Learning Disability',
    'ADHD',
    'Autism Spectrum',
    'Speech Delay',
    'Behavioral Issues',
    'Dyslexia',
    'Anxiety',
    'Depression',
    'Physical Disability',
    'Visual Impairment',
    'Hearing Impairment',
    'Intellectual Disability',
    'Emotional Regulation',
    'Social Skills',
    'Motor Skills'
  ];

  const gradeOptions = [
    'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'
  ];

  const relationshipOptions = ['Mother', 'Father', 'Guardian', 'Grandmother', 'Grandfather', 'Other'];

  useEffect(() => {
    if (isOpen) {
      loadAvailableStaff();
    }
  }, [isOpen]);

  const loadAvailableStaff = async () => {
    try {
      const staff = await studentService.getAvailableStaff();
      setAvailableStaff(staff);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const updateFormData = (updates: Partial<CreateStudentData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const updateNestedField = (field: keyof CreateStudentData, subField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field] as any,
        [subField]: value
      }
    }));
  };

  const addArrayItem = (field: 'primaryNeeds' | 'secondaryNeeds' | 'iepGoals' | 'accommodations', item: string) => {
    if (field === 'primaryNeeds' || field === 'secondaryNeeds') {
      if (!formData[field].includes(item)) {
        updateFormData({ [field]: [...formData[field], item] });
      }
    } else {
      updateFormData({ [field]: [...formData[field], item] });
    }
  };

  const removeArrayItem = (field: 'primaryNeeds' | 'secondaryNeeds' | 'iepGoals' | 'accommodations', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    updateFormData({ [field]: newArray });
  };

  const updateArrayItem = (field: 'iepGoals' | 'accommodations', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    updateFormData({ [field]: newArray });
  };

  const addMedicalArrayItem = (field: 'allergies' | 'medications' | 'conditions', item: string) => {
    if (item.trim() && !formData.medicalInfo![field].includes(item.trim())) {
      updateFormData({
        medicalInfo: {
          ...formData.medicalInfo!,
          [field]: [...formData.medicalInfo![field], item.trim()]
        }
      });
    }
  };

  const removeMedicalArrayItem = (field: 'allergies' | 'medications' | 'conditions', index: number) => {
    const newArray = formData.medicalInfo![field].filter((_, i) => i !== index);
    updateFormData({
      medicalInfo: {
        ...formData.medicalInfo!,
        [field]: newArray
      }
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.grade) newErrors.grade = 'Grade is required';
        if (!formData.age || formData.age < 3 || formData.age > 18) newErrors.age = 'Age must be between 3 and 18';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (formData.primaryNeeds.length === 0) newErrors.primaryNeeds = 'At least one primary need is required';
        break;
      case 2:
        if (!formData.parentContact.name.trim()) newErrors.parentName = 'Parent/Guardian name is required';
        if (!formData.parentContact.phone.trim()) newErrors.parentPhone = 'Parent/Guardian phone is required';
        if (!formData.parentContact.email.trim()) newErrors.parentEmail = 'Parent/Guardian email is required';
        if (!formData.emergencyContact.name.trim()) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.emergencyContact.phone.trim()) newErrors.emergencyPhone = 'Emergency contact phone is required';
        break;
      case 3:
        // Medical info is optional, no validation needed
        break;
      case 4:
        const validGoals = formData.iepGoals.filter(goal => goal.trim());
        if (validGoals.length === 0) newErrors.iepGoals = 'At least one IEP goal is required';
        const validAccommodations = formData.accommodations.filter(acc => acc.trim());
        if (validAccommodations.length === 0) newErrors.accommodations = 'At least one accommodation is required';
        break;
      case 5:
        if (formData.assignedTeachers.length === 0 && formData.assignedTherapists.length === 0) {
          newErrors.assignments = 'At least one teacher or therapist must be assigned';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      // Clean up the data before submission
      const cleanedData = {
        ...formData,
        iepGoals: formData.iepGoals.filter(goal => goal.trim()),
        accommodations: formData.accommodations.filter(acc => acc.trim()),
        secondaryNeeds: formData.secondaryNeeds?.filter(need => need.trim()) || []
      };

      const newStudent = await studentService.createStudent(cleanedData);
      onStudentAdded(newStudent);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating student:', error);
      setErrors({ submit: 'Failed to create student. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      grade: '',
      age: 0,
      dateOfBirth: '',
      primaryNeeds: [],
      secondaryNeeds: [],
      enrollmentDate: new Date().toISOString().split('T')[0],
      assignedTeachers: [],
      assignedTherapists: [],
      parentContact: {
        name: '',
        phone: '',
        email: '',
        relationship: 'Mother'
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: 'Father'
      },
      medicalInfo: {
        allergies: [],
        medications: [],
        conditions: [],
        notes: ''
      },
      iepGoals: [''],
      accommodations: ['']
    });
    setErrors({});
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Basic Information', icon: User },
    { number: 2, title: 'Contact Information', icon: Phone },
    { number: 3, title: 'Medical Information', icon: Heart },
    { number: 4, title: 'IEP Goals & Accommodations', icon: Target },
    { number: 5, title: 'Staff Assignments', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isActive ? 'bg-blue-500 border-blue-500 text-white' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter student's full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade *
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => updateFormData({ grade: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.grade ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="18"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData({ age: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.age ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Age"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => updateFormData({ enrollmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Needs * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                  {needsOptions.map(need => (
                    <label key={need} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.primaryNeeds.includes(need)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addArrayItem('primaryNeeds', need);
                          } else {
                            const index = formData.primaryNeeds.indexOf(need);
                            if (index > -1) removeArrayItem('primaryNeeds', index);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{need}</span>
                    </label>
                  ))}
                </div>
                {errors.primaryNeeds && <p className="mt-1 text-sm text-red-600">{errors.primaryNeeds}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Needs (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {needsOptions.filter(need => !formData.primaryNeeds.includes(need)).map(need => (
                    <label key={need} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.secondaryNeeds?.includes(need) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addArrayItem('secondaryNeeds', need);
                          } else {
                            const index = formData.secondaryNeeds?.indexOf(need) || -1;
                            if (index > -1) removeArrayItem('secondaryNeeds', index);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{need}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Parent/Guardian Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.parentContact.name}
                      onChange={(e) => updateNestedField('parentContact', 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.parentName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Parent/Guardian name"
                    />
                    {errors.parentName && <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <select
                      value={formData.parentContact.relationship}
                      onChange={(e) => updateNestedField('parentContact', 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {relationshipOptions.map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.parentContact.phone}
                      onChange={(e) => updateNestedField('parentContact', 'phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.parentPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.parentContact.email}
                      onChange={(e) => updateNestedField('parentContact', 'email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.parentEmail ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="parent@email.com"
                    />
                    {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.emergencyName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Emergency contact name"
                    />
                    {errors.emergencyName && <p className="mt-1 text-sm text-red-600">{errors.emergencyName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <select
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => updateNestedField('emergencyContact', 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {relationshipOptions.map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => updateNestedField('emergencyContact', 'phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.emergencyPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="(555) 987-6543"
                    />
                    {errors.emergencyPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <div className="space-y-2">
                    {formData.medicalInfo?.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                          {allergy}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMedicalArrayItem('allergies', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add allergy and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMedicalArrayItem('allergies', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications
                  </label>
                  <div className="space-y-2">
                    {formData.medicalInfo?.medications.map((medication, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {medication}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMedicalArrayItem('medications', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add medication and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMedicalArrayItem('medications', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  <div className="space-y-2">
                    {formData.medicalInfo?.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                          {condition}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMedicalArrayItem('conditions', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add condition and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMedicalArrayItem('conditions', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Notes
                </label>
                <textarea
                  value={formData.medicalInfo?.notes || ''}
                  onChange={(e) => updateFormData({
                    medicalInfo: { ...formData.medicalInfo!, notes: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional medical information or special instructions..."
                />
              </div>
            </div>
          )}

          {/* Step 4: IEP Goals & Accommodations */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IEP Goals *
                </label>
                <div className="space-y-3">
                  {formData.iepGoals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => updateArrayItem('iepGoals', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`IEP Goal ${index + 1}`}
                      />
                      {formData.iepGoals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('iepGoals', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('iepGoals', '')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Another Goal
                  </button>
                </div>
                {errors.iepGoals && <p className="mt-1 text-sm text-red-600">{errors.iepGoals}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodations *
                </label>
                <div className="space-y-3">
                  {formData.accommodations.map((accommodation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={accommodation}
                        onChange={(e) => updateArrayItem('accommodations', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Accommodation ${index + 1}`}
                      />
                      {formData.accommodations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('accommodations', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('accommodations', '')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Another Accommodation
                  </button>
                </div>
                {errors.accommodations && <p className="mt-1 text-sm text-red-600">{errors.accommodations}</p>}
              </div>
            </div>
          )}

          {/* Step 5: Staff Assignments */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Teachers
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableStaff.teachers.map(teacher => (
                    <label key={teacher.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.assignedTeachers.includes(teacher.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData({
                              assignedTeachers: [...formData.assignedTeachers, teacher.id]
                            });
                          } else {
                            updateFormData({
                              assignedTeachers: formData.assignedTeachers.filter(id => id !== teacher.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-sm text-gray-600">{teacher.department}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Therapists
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableStaff.therapists.map(therapist => (
                    <label key={therapist.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.assignedTherapists.includes(therapist.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData({
                              assignedTherapists: [...formData.assignedTherapists, therapist.id]
                            });
                          } else {
                            updateFormData({
                              assignedTherapists: formData.assignedTherapists.filter(id => id !== therapist.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{therapist.name}</p>
                        <p className="text-sm text-gray-600">{therapist.department}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {errors.assignments && <p className="mt-1 text-sm text-red-600">{errors.assignments}</p>}
            </div>
          )}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;