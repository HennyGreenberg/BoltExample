const mongoose = require('mongoose');

const answerOptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  hasSubQuestions: {
    type: Boolean,
    default: false
  },
  subQuestions: [{
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['multiple_choice'],
      default: 'multiple_choice'
    },
    options: [{
      id: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true,
        trim: true
      },
      hasSubQuestions: {
        type: Boolean,
        default: false
      },
      subQuestions: [mongoose.Schema.Types.Mixed] // Allow nested sub-questions
    }]
  }]
});

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple_choice'],
    default: 'multiple_choice'
  },
  options: [answerOptionSchema]
});

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  questions: [questionSchema]
});

const assessmentFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Behavioral', 'Speech', 'Physical', 'Social'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  categories: [categorySchema],
  createdBy: {
    type: String,
    required: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
assessmentFormSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate fields count virtual
assessmentFormSchema.virtual('fields').get(function() {
  let count = 0;
  this.categories.forEach(category => {
    count += category.questions.length;
    category.questions.forEach(question => {
      question.options.forEach(option => {
        if (option.hasSubQuestions) {
          count += option.subQuestions.length;
        }
      });
    });
  });
  return count;
});

// Ensure virtual fields are serialized
assessmentFormSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AssessmentForm', assessmentFormSchema);