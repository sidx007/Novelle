import mongoose from 'mongoose';
import { getNextSequence } from '../utils/sequencer.js';

const quoteSchema = new mongoose.Schema({
  quoteId: {
    type: Number,
    unique: true,
    index: true
  },
  bookId: {
    type: Number,
    required: true,
    index: true
  },
  bookRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null
  },
  quoteContent: {
    type: String,
    required: true,
    trim: true
  },
  pageNumber: {
    type: Number,
    default: null
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedByUserId: {
    type: Number,
    required: true,
    index: true
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
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

quoteSchema.index({ quoteContent: 'text' });

quoteSchema.pre('save', async function assignQuoteId(next) {
  if (!this.quoteId) {
    try {
      this.quoteId = await getNextSequence('quotes');
    } catch (error) {
      next(error);
      return;
    }
  }
  if (!this.visibility) {
    this.visibility = this.isPublic ? 'public' : 'private';
  } else {
    this.isPublic = this.visibility !== 'private';
  }
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;
