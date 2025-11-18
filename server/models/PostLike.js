import mongoose from 'mongoose';

const postLikeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only like a post once
postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const PostLike = mongoose.model('PostLike', postLikeSchema);

export default PostLike;
