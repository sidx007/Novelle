import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import { getNextSequence } from '../utils/sequencer.js';

const router = express.Router();

const normalizeString = (value) => value?.trim() || '';

router.post('/quotes', protect, async (req, res) => {
  try {
    const { book, quote } = req.body;

    if (!quote?.text || !book?.title || !book?.author) {
      return res.status(400).json({
        success: false,
        message: 'Book title, book author, and quote text are required.'
      });
    }

    const booksCollection = mongoose.connection.db.collection('books');
    const quotesCollection = mongoose.connection.db.collection('quotes');
    const postsCollection = mongoose.connection.db.collection('posts');

    const title = normalizeString(book.title);
    const author = normalizeString(book.author);

    const existingBook = await booksCollection.findOne({
      Title: { $regex: `^${title}$`, $options: 'i' },
      Author: { $regex: `^${author}$`, $options: 'i' }
    });

    let bookId;
    let bookDoc;

    if (existingBook) {
      bookId = existingBook.BookID || existingBook._id?.toString();
      bookDoc = existingBook;
    } else {
      bookId = await getNextSequence('books');
      const now = new Date().toISOString();
      bookDoc = {
        BookID: bookId,
        Title: title,
        Author: author,
        CoverImage: book.coverImage || null,
        Description: book.description || null,
        Genre: book.genre || null,
        PageCount: book.pageCount || null,
        Source: 'user',
        CreatedByUserID: req.user.userId || req.user._id.toString(),
        CreatedAt: now,
        UpdatedAt: now,
        title,
        author,
        coverImage: book.coverImage || null,
        description: book.description || null,
        genre: book.genre || null,
        pageCount: book.pageCount || null
      };

      await booksCollection.insertOne(bookDoc);
    }

    const quoteId = await getNextSequence('quotes');
    const now = new Date().toISOString();

    const quoteDoc = {
      QuoteID: quoteId,
      BookID: bookId,
      QuoteContent: quote.text.trim(),
      Author: quote.author || author,
      PageNumber: quote.pageNumber || null,
      Notes: quote.notes || null,
      Source: 'user',
      CreatedByUserID: req.user.userId || req.user._id.toString(),
      CreatedByUserObjectId: req.user._id.toString(),
      Visibility: quote.isPublic === false ? 'private' : 'public',
      CreatedAt: now,
      UpdatedAt: now
    };

    await quotesCollection.insertOne(quoteDoc);

    const postId = await getNextSequence('posts');
    const postDoc = {
      PostID: postId,
      UserID: req.user.userId || req.user._id.toString(),
      QuoteID: quoteId,
      BookID: bookId,
      Title: quoteDoc.QuoteContent.substring(0, 120),
      PhotoLink: bookDoc?.CoverImage || null,
      Views: 0,
      CreatedAt: now,
      UpdatedAt: now,
      Type: 'Quote',
      CreatedByUserObjectId: req.user._id.toString()
    };

    await postsCollection.insertOne(postDoc);

    res.status(201).json({
      success: true,
      data: {
        quote: quoteDoc,
        book: bookDoc || await booksCollection.findOne({ BookID: bookId }),
        post: postDoc
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
