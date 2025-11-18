import mongoose from 'mongoose';

const currentlyReadingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  progress: {
    currentPage: {
      type: Number,
      default: 0
    },
    totalPages: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastReadAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['reading', 'paused', 'completed'],
    default: 'reading'
  },
  notes: {
    type: String,
    maxlength: 1000
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

// Indexes
currentlyReadingSchema.index({ userId: 1, status: 1 });
currentlyReadingSchema.index({ userId: 1, lastReadAt: -1 });

// Method to calculate reading percentage
currentlyReadingSchema.methods.updatePercentage = function() {
  if (this.progress.totalPages > 0) {
    this.progress.percentage = Math.round((this.progress.currentPage / this.progress.totalPages) * 100);
  }
  return this;
};

const CurrentlyReading = mongoose.model('CurrentlyReading', currentlyReadingSchema);

export default CurrentlyReading;
