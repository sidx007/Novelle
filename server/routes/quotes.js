import express from 'express';
import Quote from '../models/Quote.js';
import Book from '../models/Book.js';

const router = express.Router();

// GET all public quotes with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quotes = await Quote.find({ isPublic: true })
      .populate('bookId', 'title author coverImage')
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments({ isPublic: true });

    res.json({
      success: true,
      data: quotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET quotes by book ID
router.get('/book/:bookId', async (req, res) => {
  try {
    const quotes = await Quote.find({ 
      bookId: req.params.bookId,
      isPublic: true 
    })
      .populate('addedBy', 'username')
      .sort({ likes: -1 });

    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single quote by ID
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('bookId', 'title author coverImage')
      .populate('addedBy', 'username');

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new quote
router.post('/', async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();

    const populatedQuote = await Quote.findById(quote._id)
      .populate('bookId', 'title author coverImage')
      .populate('addedBy', 'username');

    res.status(201).json({ success: true, data: populatedQuote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update quote
router.put('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('bookId', 'title author coverImage')
      .populate('addedBy', 'username');

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE quote
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST increment likes
router.post('/:id/like', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
