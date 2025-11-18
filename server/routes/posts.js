import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import QuoteLike from '../models/QuoteLike.js';
import QuoteSave from '../models/QuoteSave.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all public posts
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const postsCollection = mongoose.connection.db.collection('posts');
    const quotesCollection = mongoose.connection.db.collection('quotes');
    const booksCollection = mongoose.connection.db.collection('books');
    const usersCollection = mongoose.connection.db.collection('users');

    const toNumber = (value) => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'number') return value;
      if (typeof value === 'object' && typeof value.toNumber === 'function') {
        try {
          return value.toNumber();
        } catch (err) {
          return null;
        }
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const toStringSafe = (value) => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'string') return value;
      if (typeof value === 'number' && Number.isFinite(value)) return value.toString();
      if (typeof value === 'object' && value !== null) {
        if (typeof value.toString === 'function') {
          const strValue = value.toString();
          return strValue === '[object Object]' ? null : strValue;
        }
        if (typeof value.toHexString === 'function') {
          return value.toHexString();
        }
      }
      return null;
    };

    const quoteFilter = {
      QuoteContent: { $exists: true, $ne: null, $ne: '' }
    };

    const [total, quotes] = await Promise.all([
      quotesCollection.countDocuments(quoteFilter),
      quotesCollection
        .find(quoteFilter)
        .sort({ CreatedAt: -1, QuoteID: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()
    ]);

    if (!quotes.length) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1
        }
      });
    }

    const quoteIdNumbers = new Set();
    const quoteIdStrings = new Set();
    const bookIdNumbers = new Set();
    const bookIdStrings = new Set();

    quotes.forEach((quoteDoc) => {
      const quoteIdNum = toNumber(quoteDoc.QuoteID);
      const quoteIdStr = toStringSafe(quoteDoc.QuoteID);
      if (quoteIdNum !== null) quoteIdNumbers.add(quoteIdNum);
      if (quoteIdStr) quoteIdStrings.add(quoteIdStr);

      const bookIdNum = toNumber(quoteDoc.BookID);
      const bookIdStr = toStringSafe(quoteDoc.BookID);
      if (bookIdNum !== null) bookIdNumbers.add(bookIdNum);
      if (bookIdStr) bookIdStrings.add(bookIdStr);
    });

    const postsQuery = { $or: [] };
    if (quoteIdNumbers.size > 0) {
      postsQuery.$or.push({ QuoteID: { $in: Array.from(quoteIdNumbers) } });
    }
    if (quoteIdStrings.size > 0) {
      postsQuery.$or.push({ QuoteID: { $in: Array.from(quoteIdStrings) } });
    }

    const relatedPosts = postsQuery.$or.length
      ? await postsCollection.find(postsQuery).toArray()
      : [];

    const postMap = new Map();
    relatedPosts
      .sort((a, b) => new Date(b.CreatedAt || 0).getTime() - new Date(a.CreatedAt || 0).getTime())
      .forEach((post) => {
        const postQuoteNum = toNumber(post.QuoteID);
        const postQuoteStr = toStringSafe(post.QuoteID);
        if (postQuoteNum !== null && !postMap.has(postQuoteNum)) {
          postMap.set(postQuoteNum, post);
        }
        if (postQuoteStr && !postMap.has(postQuoteStr)) {
          postMap.set(postQuoteStr, post);
        }

        const numBookId = toNumber(post.BookID);
        const strBookId = toStringSafe(post.BookID);
        if (numBookId !== null) bookIdNumbers.add(numBookId);
        if (strBookId) bookIdStrings.add(strBookId);
      });

    const userIdNumbers = new Set();
    const userIdStrings = new Set();

    relatedPosts.forEach((post) => {
      const numUserId = toNumber(post.UserID);
      const strUserId = toStringSafe(post.UserID);
      if (numUserId !== null) userIdNumbers.add(numUserId);
      if (strUserId) userIdStrings.add(strUserId);
    });

    const bookQuery = { $or: [] };
    if (bookIdNumbers.size > 0) {
      bookQuery.$or.push({ BookID: { $in: Array.from(bookIdNumbers) } });
    }
    if (bookIdStrings.size > 0) {
      bookQuery.$or.push({ BookID: { $in: Array.from(bookIdStrings) } });
    }

    const bookDocs = bookQuery.$or.length
      ? await booksCollection.find(bookQuery).toArray()
      : [];

    const bookMap = new Map();
    bookDocs.forEach((book) => {
      const numBookId = toNumber(book.BookID);
      const strBookId = toStringSafe(book.BookID);
      if (numBookId !== null) bookMap.set(numBookId, book);
      if (strBookId) bookMap.set(strBookId, book);
    });

    const userQuery = { $or: [] };
    if (userIdNumbers.size > 0) {
      userQuery.$or.push({ UserID: { $in: Array.from(userIdNumbers) } });
    }
    if (userIdStrings.size > 0) {
      userQuery.$or.push({ UserID: { $in: Array.from(userIdStrings) } });
    }

    const userDocs = userQuery.$or.length
      ? await usersCollection.find(userQuery).toArray()
      : [];

    const userMap = new Map();
    userDocs.forEach((user) => {
      const numericKey = user.UserID ?? user.userId ?? user.userID;
      const numUserId = toNumber(numericKey);
      const strUserId = toStringSafe(numericKey);
      if (numUserId !== null) userMap.set(numUserId, user);
      if (strUserId) userMap.set(strUserId, user);
    });

    const data = quotes.map((quoteDoc) => {
      const quoteIdNum = toNumber(quoteDoc.QuoteID);
      const quoteIdStr = toStringSafe(quoteDoc.QuoteID);
      const relatedPost = postMap.get(quoteIdNum) || postMap.get(quoteIdStr) || null;

      const rawBookId = quoteDoc.BookID !== undefined && quoteDoc.BookID !== null
        ? quoteDoc.BookID
        : relatedPost?.BookID;
      const bookIdNum = toNumber(rawBookId);
      const bookIdStr = toStringSafe(rawBookId);
      const book = bookMap.get(bookIdNum) || bookMap.get(bookIdStr) || null;

      const rawUserId = relatedPost?.UserID;
      const userIdNum = toNumber(rawUserId);
      const userIdStr = toStringSafe(rawUserId);
      const user = userMap.get(userIdNum) || userMap.get(userIdStr) || null;

      return {
        postObjectId: relatedPost?._id || null,
        postId: relatedPost?.PostID || null,
        quoteId: quoteDoc.QuoteID,
        quoteText: quoteDoc.QuoteContent,
        bookId: book?.BookID || rawBookId || null,
        userId: user?.UserID || user?.userId || relatedPost?.UserID || null,
        postTitle: relatedPost?.Title || null,
        type: relatedPost?.Type || 'Quote',
        photoLink: relatedPost?.PhotoLink || null,
        views: relatedPost?.Views || 0,
        createdAt: relatedPost?.CreatedAt || quoteDoc.CreatedAt || new Date().toISOString(),
        updatedAt: relatedPost?.UpdatedAt || quoteDoc.UpdatedAt || null,
        user: user
          ? {
              userId: user.UserID || user.userId || user.userID || null,
              name: user.Name || user.name || user.username || null,
              email: user.Email || user.email || null
            }
          : null,
        book: book
          ? {
              bookId: book.BookID,
              title: book.Title,
              author: book.Author,
              coverImage: book.CoverImage
            }
          : null,
        quote: {
          quoteId: quoteDoc.QuoteID,
          content: quoteDoc.QuoteContent,
          author: quoteDoc.Author || book?.Author || user?.Name || null,
          bookId: quoteDoc.BookID || book?.BookID || null,
          pageNumber: quoteDoc.PageNumber || null
        },
        quoteDetails: {
          quoteId: quoteDoc.QuoteID,
          pageNumber: quoteDoc.PageNumber || null
        }
      };
    });

    const quoteKeys = data
      .map((item) => toStringSafe(item.quoteId))
      .filter((key) => Boolean(key));

    const [likeAggregation, saveAggregation, userLikes, userSaves] = await Promise.all([
      quoteKeys.length
        ? QuoteLike.aggregate([
            { $match: { quoteId: { $in: quoteKeys } } },
            { $group: { _id: '$quoteId', count: { $sum: 1 } } }
          ])
        : Promise.resolve([]),
      quoteKeys.length
        ? QuoteSave.aggregate([
            { $match: { quoteId: { $in: quoteKeys } } },
            { $group: { _id: '$quoteId', count: { $sum: 1 } } }
          ])
        : Promise.resolve([]),
      req.user && quoteKeys.length
        ? QuoteLike.find({ quoteId: { $in: quoteKeys }, userId: req.user._id }).select('quoteId')
        : Promise.resolve([]),
      req.user && quoteKeys.length
        ? QuoteSave.find({ quoteId: { $in: quoteKeys }, userId: req.user._id }).select('quoteId')
        : Promise.resolve([])
    ]);

    const likeMap = new Map(likeAggregation.map((entry) => [entry._id, entry.count]));
    const saveMap = new Map(saveAggregation.map((entry) => [entry._id, entry.count]));
    const userLikeSet = new Set(userLikes.map((entry) => entry.quoteId));
    const userSaveSet = new Set(userSaves.map((entry) => entry.quoteId));

    const enrichedData = data.map((item) => {
      const key = toStringSafe(item.quoteId);
      return {
        ...item,
        interactions: {
          likesCount: likeMap.get(key) || 0,
          savesCount: saveMap.get(key) || 0,
          likedByUser: userLikeSet.has(key),
          savedByUser: userSaveSet.has(key)
        }
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username name avatar')
      .populate({
        path: 'quoteId',
        populate: {
          path: 'bookId',
          select: 'title author coverImage'
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { content, type, quoteId, isPublic } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const post = await Post.create({
      userId: req.user._id,
      content,
      type: type || 'thought',
      quoteId: quoteId || null,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username name avatar')
      .populate({
        path: 'quoteId',
        populate: {
          path: 'bookId',
          select: 'title author coverImage'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { content, type, isPublic } = req.body;

    if (content !== undefined) post.content = content;
    if (type !== undefined) post.type = type;
    if (isPublic !== undefined) post.isPublic = isPublic;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('userId', 'username name avatar')
      .populate({
        path: 'quoteId',
        populate: {
          path: 'bookId',
          select: 'title author coverImage'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
});

export default router;
