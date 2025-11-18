import mongoose from 'mongoose';

const quoteLikeSchema = new mongoose.Schema({
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

quoteLikeSchema.index({ quoteId: 1, userId: 1 }, { unique: true });

const QuoteLike = mongoose.model('QuoteLike', quoteLikeSchema);

export default QuoteLike;
