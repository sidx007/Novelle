import express from 'express';
import mongoose from 'mongoose';
import UserProfile from '../models/UserProfile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

router.get('/me', protect, async (req, res) => {
  try {
    const numericUserId = req.user.userId ?? toNumber(req.user.UserID);

    const profile = await UserProfile.findOne({ userId: req.user._id })
      .lean()
      .catch(() => null);

    const postsCollection = mongoose.connection.db.collection('posts');
    const quotesCollection = mongoose.connection.db.collection('quotes');
    const booksCollection = mongoose.connection.db.collection('books');

    const [posts, quotes] = await Promise.all([
      numericUserId !== null
        ? postsCollection.find({ UserID: numericUserId }).sort({ CreatedAt: -1 }).limit(50).toArray()
        : [],
      numericUserId !== null
        ? quotesCollection.find({ CreatedByUserID: numericUserId }).sort({ CreatedAt: -1 }).limit(100).toArray()
        : []
    ]);

    const bookIdSet = new Set();
    posts.forEach((post) => {
      const id = toNumber(post.BookID);
      if (id !== null) bookIdSet.add(id);
    });
    quotes.forEach((quote) => {
      const id = toNumber(quote.BookID);
      if (id !== null) bookIdSet.add(id);
    });

    const books = bookIdSet.size
      ? await booksCollection.find({ BookID: { $in: Array.from(bookIdSet) } }).toArray()
      : [];
    const bookMap = new Map();
    books.forEach((book) => {
      const id = toNumber(book.BookID);
      if (id !== null) {
        bookMap.set(id, book);
      }
    });

    const formattedPosts = posts.map((post) => {
      const book = bookMap.get(toNumber(post.BookID));
      return {
        postId: post.PostID || post.postId || null,
        quoteId: post.QuoteID || null,
        bookId: post.BookID || null,
        title: post.Title || null,
        photo: post.PhotoLink || null,
        views: post.Views || 0,
        type: post.Type || 'Quote',
        createdAt: post.CreatedAt || post.createdAt || null,
        book: book
          ? {
              title: book.Title || book.title,
              author: book.Author || book.author,
              coverImage: book.CoverImage || book.coverImage
            }
          : null
      };
    });

    const formattedQuotes = quotes.map((quote) => {
      const book = bookMap.get(toNumber(quote.BookID));
      return {
        quoteId: quote.QuoteID || quote.quoteId,
        bookId: quote.BookID,
        content: quote.QuoteContent || quote.quoteContent,
        pageNumber: quote.PageNumber || null,
        createdAt: quote.CreatedAt || quote.createdAt || null,
        visibility: quote.Visibility || 'public',
        book: book
          ? {
              title: book.Title || book.title,
              author: book.Author || book.author,
              coverImage: book.CoverImage || book.coverImage
            }
          : null
      };
    });

    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          userId: req.user.userId,
          username: req.user.username,
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.avatar || null,
          createdAt: req.user.createdAt
        },
        profile: profile
          ? {
              profileId: profile.profileId,
              displayName: profile.displayName,
              bio: profile.bio,
              profilePicture: profile.profilePicture,
              favoriteGenres: profile.favoriteGenres,
              readingGoal: profile.readingGoal,
              booksRead: profile.booksRead,
              joinedDate: profile.joinedDate,
              lastActive: profile.lastActive
            }
          : null,
        posts: formattedPosts,
        quotes: formattedQuotes
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

export default router;
