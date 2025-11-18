import express from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book.js';

const router = express.Router();

// GET all books with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const genre = req.query.genre;

    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (genre) {
      query.genre = genre;
    }

    const books = await Book.find(query)
      .sort({ rating: -1, title: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
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

// GET single book by ID
const mapBookDocument = (doc) => ({
  bookId: doc?.bookId || doc?.BookID || (doc?._id ? doc._id.toString() : null),
  title: doc?.title || doc?.Title || '',
  author: doc?.author || doc?.Author || '',
  content: doc?.content || doc?.Content || '',
  coverImage: doc?.coverImage || doc?.CoverImage || null,
  publishedDate: doc?.publishedDate || doc?.PublishedDate || null,
  isbn: doc?.isbn || doc?.ISBN || null,
  genre: doc?.genre || doc?.Genre || [],
  pageCount: doc?.pageCount || doc?.PageCount || null,
  createdAt: doc?.createdAt || doc?.CreatedAt || null,
  updatedAt: doc?.updatedAt || doc?.UpdatedAt || null
});

const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let bookDoc = null;

    if (mongoose.isValidObjectId(id)) {
      const book = await Book.findById(id).lean();
      if (book) {
        bookDoc = book;
      }
    }

    if (!bookDoc) {
      const booksCollection = mongoose.connection.db.collection('books');
      const numericId = toNumber(id);
      const query = Number.isFinite(numericId)
        ? { BookID: numericId }
        : {
            $or: [
              { BookID: id },
              { bookId: id },
              { ISBN: id },
              { isbn: id },
              { Title: id },
              { title: id }
            ]
          };

      bookDoc = await booksCollection.findOne(query);
    }

    if (!bookDoc) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const quotesCollection = mongoose.connection.db.collection('quotes');
    const numericBookId = toNumber(bookDoc.BookID ?? bookDoc.bookId);

    const quotes = numericBookId !== null
      ? await quotesCollection
          .find({ BookID: numericBookId })
          .sort({ CreatedAt: -1 })
          .limit(100)
          .toArray()
      : [];

    const formattedQuotes = quotes.map((quote) => ({
      quoteId: quote.QuoteID || quote.quoteId,
      content: quote.QuoteContent || quote.quoteContent,
      author: quote.Author || bookDoc.Author || bookDoc.author,
      pageNumber: quote.PageNumber || null,
      createdAt: quote.CreatedAt || quote.createdAt || null
    }));

    res.json({
      success: true,
      data: {
        book: mapBookDocument(bookDoc),
        quotes: formattedQuotes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
