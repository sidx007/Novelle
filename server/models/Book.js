import mongoose from 'mongoose';
import { getNextSequence } from '../utils/sequencer.js';

const bookSchema = new mongoose.Schema({
  bookId: {
    type: Number,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    maxlength: 5000,
    default: ''
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  coverImage: {
    type: String,
    default: null
  },
  publishedDate: {
    type: Date,
    default: null
  },
  genre: [{
    type: String
  }],
  pageCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });

bookSchema.pre('save', async function assignBookId(next) {
  if (!this.bookId) {
    try {
      this.bookId = await getNextSequence('books');
    } catch (error) {
      next(error);
      return;
    }
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
