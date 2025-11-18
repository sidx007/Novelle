import mongoose from 'mongoose';
import { getNextSequence } from '../utils/sequencer.js';

const userProfileSchema = new mongoose.Schema({
  profileId: {
    type: Number,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  userNumericId: {
    type: Number,
    required: true,
    index: true
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profilePicture: {
    type: String,
    default: null
  },
  favoriteGenres: [{
    type: String
  }],
  readingGoal: {
    type: Number,
    default: 0
  },
  booksRead: {
    type: Number,
    default: 0
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for user lookup

userProfileSchema.pre('save', async function assignProfileId(next) {
  if (!this.profileId) {
    try {
      this.profileId = await getNextSequence('userprofile');
    } catch (error) {
      next(error);
      return;
    }
  }

  if (!this.joinedDate) {
    this.joinedDate = new Date();
  }
  this.lastActive = new Date();
  next();
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
