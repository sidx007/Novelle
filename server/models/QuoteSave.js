import mongoose from 'mongoose';

const quoteSaveSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

quoteSaveSchema.index({ quoteId: 1, userId: 1 }, { unique: true });

const QuoteSave = mongoose.model('QuoteSave', quoteSaveSchema);

export default QuoteSave;
