const express = require('express');
const { body, validationResult } = require('express-validator');
const AssessmentForm = require('../models/AssessmentForm');

const router = express.Router();

// Get all assessment forms
router.get('/', async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = { isActive: true };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let forms = await AssessmentForm.find(query).sort({ updatedAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      forms = forms.filter(form => 
        searchRegex.test(form.title) || 
        searchRegex.test(form.description)
      );
    }

    res.json(forms);
  } catch (error) {
    console.error('Error fetching assessment forms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessment form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await AssessmentForm.findById(req.params.id);
    if (!form || !form.isActive) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching assessment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new assessment form
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Academic', 'Behavioral', 'Speech', 'Physical', 'Social']).withMessage('Valid category is required'),
  body('categories').isArray({ min: 1 }).withMessage('At least one category is required'),
  body('createdBy').trim().notEmpty().withMessage('Creator ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, categories, createdBy, status = 'draft' } = req.body;

    // Validate categories structure
    for (const cat of categories) {
      if (!cat.name || !cat.name.trim()) {
        return res.status(400).json({ error: 'Category name is required' });
      }
      
      if (!cat.questions || cat.questions.length === 0) {
        return res.status(400).json({ error: 'Each category must have at least one question' });
      }

      for (const question of cat.questions) {
        if (!question.text || !question.text.trim()) {
          return res.status(400).json({ error: 'Question text is required' });
        }
        
        if (!question.options || question.options.length < 2) {
          return res.status(400).json({ error: 'Each question must have at least 2 options' });
        }

        for (const option of question.options) {
          if (!option.text || !option.text.trim()) {
            return res.status(400).json({ error: 'Option text is required' });
          }
        }
      }
    }

    const assessmentForm = new AssessmentForm({
      title,
      description,
      category,
      categories,
      createdBy,
      status
    });

    await assessmentForm.save();
    res.status(201).json(assessmentForm);
  } catch (error) {
    console.error('Error creating assessment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update assessment form
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isIn(['Academic', 'Behavioral', 'Speech', 'Physical', 'Social']).withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const form = await AssessmentForm.findById(req.params.id);
    if (!form || !form.isActive) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        form[key] = updates[key];
      }
    });

    await form.save();
    res.json(form);
  } catch (error) {
    console.error('Error updating assessment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete assessment form (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const form = await AssessmentForm.findById(req.params.id);
    if (!form || !form.isActive) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }

    form.isActive = false;
    await form.save();

    res.json({ message: 'Assessment form deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Archive/Unarchive assessment form
router.patch('/:id/archive', async (req, res) => {
  try {
    const form = await AssessmentForm.findById(req.params.id);
    if (!form || !form.isActive) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }

    form.status = form.status === 'archived' ? 'active' : 'archived';
    await form.save();

    res.json(form);
  } catch (error) {
    console.error('Error archiving assessment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Duplicate assessment form
router.post('/:id/duplicate', async (req, res) => {
  try {
    const originalForm = await AssessmentForm.findById(req.params.id);
    if (!originalForm || !originalForm.isActive) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }

    const { createdBy } = req.body;
    if (!createdBy) {
      return res.status(400).json({ error: 'Creator ID is required' });
    }

    const duplicatedForm = new AssessmentForm({
      title: `${originalForm.title} (Copy)`,
      description: originalForm.description,
      category: originalForm.category,
      categories: originalForm.categories,
      createdBy,
      status: 'draft'
    });

    await duplicatedForm.save();
    res.status(201).json(duplicatedForm);
  } catch (error) {
    console.error('Error duplicating assessment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment usage count
router.patch('/:id/use', async (req, res) => {
  try {
    const form = await AssessmentForm.findById(req.params.id);
    if (!form || !form.isActive) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }

    form.usageCount += 1;
    await form.save();

    res.json({ usageCount: form.usageCount });
  } catch (error) {
    console.error('Error updating usage count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get form categories statistics
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await AssessmentForm.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = [
      { name: 'Academic', count: 0, color: 'bg-blue-100 text-blue-700' },
      { name: 'Behavioral', count: 0, color: 'bg-green-100 text-green-700' },
      { name: 'Speech', count: 0, color: 'bg-yellow-100 text-yellow-700' },
      { name: 'Physical', count: 0, color: 'bg-purple-100 text-purple-700' },
      { name: 'Social', count: 0, color: 'bg-pink-100 text-pink-700' }
    ];

    stats.forEach(stat => {
      const category = categoryStats.find(cat => cat.name === stat._id);
      if (category) {
        category.count = stat.count;
      }
    });

    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;