// MongoDB initialization script
// This script will run when the MongoDB container starts for the first time

// Switch to the auth database
db = db.getSiblingDB('auth_db');

// Create users collection with indexes
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Insert default admin user
db.users.insertOne({
  email: 'admin@school.com',
  password: '$2a$10$YourHashedPasswordHere', // This should be a properly hashed password
  name: 'System Administrator',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Switch to the user database
db = db.getSiblingDB('user_db');

// Create users collection with indexes
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

// Switch to the student database
db = db.getSiblingDB('student_db');

// Create students collection with indexes
db.createCollection('students');
db.students.createIndex({ studentId: 1 }, { unique: true });
db.students.createIndex({ grade: 1 });
db.students.createIndex({ isActive: 1 });

// Create assessments collection with indexes
db.createCollection('assessments');
db.assessments.createIndex({ studentId: 1 });
db.assessments.createIndex({ assessmentType: 1 });
db.assessments.createIndex({ dateCreated: 1 });
db.assessments.createIndex({ status: 1 });

// Create assessment forms collection
db.createCollection('assessmentforms');
db.assessmentforms.createIndex({ category: 1 });
db.assessmentforms.createIndex({ isActive: 1 });

// Switch to the report database
db = db.getSiblingDB('report_db');

// Create reports collection with indexes
db.createCollection('reports');
db.reports.createIndex({ studentId: 1 });
db.reports.createIndex({ reportType: 1 });
db.reports.createIndex({ dateGenerated: 1 });

print('Database initialization completed successfully!');