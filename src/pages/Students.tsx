import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studentService, type Student } from '../services/studentService';
import AddStudentModal from '../components/AddStudentModal';
import { Search, Filter, Plus, Eye, Edit, Calendar, User } from 'lucide-react';

const Students: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load students on component mount
  React.useEffect(() => {
    loadStudents();
  }, [user]);

  const loadStudents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // For teachers and therapists, only load their assigned students
      // For admins, load all students
      const filters = user.role !== 'admin' ? { assignedToUser: user.id } : {};
      
      const studentsData = await studentService.getAllStudents(filters);
      setStudents(studentsData);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setShowAddModal(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const getProgressColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'stable': return 'text-blue-600 bg-blue-100';
      case 'needs_attention': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressText = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Improving';
      case 'stable': return 'Stable';
      case 'needs_attention': return 'Needs Attention';
      default: return 'No Data';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Grades</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadStudents}
            className="mt-2 text-red-600 hover:text-red-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredStudents.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {students.length === 0 ? 'No students found' : 'No students match your search'}
          </h3>
          <p className="text-gray-600 mb-4">
            {students.length === 0 
              ? user?.role === 'admin' 
                ? 'Get started by adding your first student.'
                : 'No students have been assigned to you yet.'
              : 'Try adjusting your search criteria.'
            }
          </p>
          {user?.role === 'admin' && students.length === 0 && (
            <button 
            >
              <Plus className="h-4 w-4" />
              <span>Add Student</span>
            </button>
          )}
        </div>
      )}

      {/* Students Grid */}
      {filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={student.image || `https://images.pexels.com/photos/3663611/pexels-photo-3663611.jpeg?auto=compress&cs=tinysrgb&w=150`}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.grade} • Age {student.age}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(student.progressTrend)}`}>
                    {getProgressText(student.progressTrend)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Primary Needs:</p>
              <div className="flex flex-wrap gap-2">
                {student.primaryNeeds.map((need, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {need}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Last assessment: {student.lastAssessment 
                  ? new Date(student.lastAssessment).toLocaleDateString()
                  : 'No assessments yet'
                }
              </span>
            </div>

            <div className="mt-4 flex space-x-2">
              <Link
                to={`/students/${student.id}`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </Link>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

export default Students;