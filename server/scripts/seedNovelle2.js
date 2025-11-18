import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import { getNextSequence, ensureSequence } from '../utils/sequencer.js';

dotenv.config();

const SEQUENCE_KEYS = [
  'users',
  'userprofile',
  'books',
  'quotes',
  'posts',
  'currentlyreading',
  'postlikes',
  'savedposts'
];

const BOOK_SEEDS = [
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    content: 'The manners and matrimonial machinations among the British gentry of the early 19th century.',
    coverImage: 'https://images.unsplash.com/photo-1544937950-fa07a98d237f?w=800&h=1200&fit=crop',
    publishedDate: new Date('1813-01-28'),
    isbn: '9780141199078',
    genre: ['Classics', 'Romance'],
    pageCount: 432
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    content: 'A portrait of the Roaring Twenties and a love story doomed by excess and illusion.',
    coverImage: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&h=1200&fit=crop',
    publishedDate: new Date('1925-04-10'),
    isbn: '9780743273565',
    genre: ['Classics', 'Tragedy'],
    pageCount: 180
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    content: 'Bilbo Baggins ventures beyond the Shire on a journey filled with dwarves, dragons, and bravery.',
    coverImage: 'https://images.unsplash.com/photo-1529651737248-dad5e23dba04?w=800&h=1200&fit=crop',
    publishedDate: new Date('1937-09-21'),
    isbn: '9780345339683',
    genre: ['Classics', 'Fantasy'],
    pageCount: 310
  }
];

const QUOTE_SEEDS = [
  {
    bookTitle: 'Pride and Prejudice',
    content: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    author: 'Jane Austen',
    pageNumber: 1
  },
  {
    bookTitle: 'The Great Gatsby',
    content: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    author: 'F. Scott Fitzgerald',
    pageNumber: 180
  },
  {
    bookTitle: 'The Hobbit',
    content: 'If more of us valued food and cheer and song above hoarded gold, it would be a merrier world.',
    author: 'J.R.R. Tolkien',
    pageNumber: 187
  }
];

const nowISO = () => new Date().toISOString();

const seedNovelle2 = async () => {
  await connectDB();

  console.log('🧹 Resetting Novelle2 database...');
  await mongoose.connection.db.dropDatabase();
  console.log('✅ Database cleared');

  await Promise.all(SEQUENCE_KEYS.map((key) => ensureSequence(key, 1)));

  console.log('👤 Creating demo user...');
  const demoUser = await User.create({
    username: 'novelle_reader',
    email: 'reader@novelle.app',
    password: 'password123',
    name: 'Novelle Reader'
  });

  await UserProfile.create({
    userId: demoUser._id,
    userNumericId: demoUser.userId,
    displayName: 'Novelle Reader',
    bio: 'Lover of timeless literature and cozy reading nooks.',
    profilePicture: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=400&fit=crop',
    favoriteGenres: ['Classics', 'Romance', 'Fantasy'],
    readingGoal: 24,
    booksRead: 8
  });

  const usersCollection = mongoose.connection.db.collection('users');
  await usersCollection.updateOne(
    { _id: demoUser._id },
    {
      $set: {
        UserID: demoUser.userId,
        Name: demoUser.name,
        Email: demoUser.email,
        CreatedAt: demoUser.createdAt,
        UpdatedAt: demoUser.updatedAt
      }
    }
  );

  console.log('📚 Inserting books...');
  const booksCollection = mongoose.connection.db.collection('books');
  const booksInserted = [];

  for (const seed of BOOK_SEEDS) {
    const bookId = await getNextSequence('books');
    const timestamp = nowISO();
    const bookDoc = {
      BookID: bookId,
      bookId,
      Title: seed.title,
      title: seed.title,
      Author: seed.author,
      author: seed.author,
      Content: seed.content,
      content: seed.content,
      CoverImage: seed.coverImage,
      coverImage: seed.coverImage,
      PublishedDate: seed.publishedDate,
      publishedDate: seed.publishedDate,
      ISBN: seed.isbn,
      isbn: seed.isbn,
      Genre: seed.genre,
      genre: seed.genre,
      PageCount: seed.pageCount,
      pageCount: seed.pageCount,
      CreatedAt: timestamp,
      UpdatedAt: timestamp
    };

    await booksCollection.insertOne(bookDoc);
    booksInserted.push(bookDoc);
  }

  console.log('📝 Inserting quotes and posts...');
  const quotesCollection = mongoose.connection.db.collection('quotes');
  const postsCollection = mongoose.connection.db.collection('posts');
  const quotesInserted = [];
  const postsInserted = [];

  for (const seed of QUOTE_SEEDS) {
    const bookDoc = booksInserted.find((book) => book.Title === seed.bookTitle);
    if (!bookDoc) continue;

    const quoteId = await getNextSequence('quotes');
    const createdAt = nowISO();
    const quoteDoc = {
      QuoteID: quoteId,
      quoteId,
      BookID: bookDoc.BookID,
      bookId: bookDoc.BookID,
      QuoteContent: seed.content,
      quoteContent: seed.content,
      Author: seed.author || bookDoc.Author,
      PageNumber: seed.pageNumber ?? null,
      Source: 'seed',
      CreatedByUserID: demoUser.userId,
      CreatedByUserObjectId: demoUser._id.toString(),
      Visibility: 'public',
      CreatedAt: createdAt,
      UpdatedAt: createdAt,
      createdAt: new Date(createdAt),
      updatedAt: new Date(createdAt)
    };

    await quotesCollection.insertOne(quoteDoc);
    quotesInserted.push(quoteDoc);

    const postId = await getNextSequence('posts');
    const postCreatedAt = nowISO();
    const postDoc = {
      PostID: postId,
      postId,
      UserID: demoUser.userId,
      QuoteID: quoteDoc.QuoteID,
      BookID: quoteDoc.BookID,
      Title: quoteDoc.QuoteContent.substring(0, 120),
      PhotoLink: bookDoc.CoverImage,
      Views: Math.floor(Math.random() * 400) + 50,
      Type: 'Quote',
      CreatedAt: postCreatedAt,
      UpdatedAt: postCreatedAt,
      CreatedByUserObjectId: demoUser._id.toString()
    };

    await postsCollection.insertOne(postDoc);
    postsInserted.push(postDoc);
  }

  console.log('📖 Inserting currently reading entry...');
  const currentlyReadingCollection = mongoose.connection.db.collection('currentlyreading');
  const readingId = await getNextSequence('currentlyreading');
  const readingTimestamp = nowISO();
  await currentlyReadingCollection.insertOne({
    ReadingID: readingId,
    readingId,
    UserID: demoUser.userId,
    BookID: booksInserted[0]?.BookID || null,
    StartDate: readingTimestamp,
    startDate: new Date(readingTimestamp),
    Progress: 45,
    LastUpdated: readingTimestamp,
    lastUpdated: new Date(readingTimestamp)
  });

  console.log('❤️ Inserting likes and saves...');
  const postLikesCollection = mongoose.connection.db.collection('postlikes');
  const savedPostsCollection = mongoose.connection.db.collection('savedposts');

  if (postsInserted.length > 0) {
    const likeId = await getNextSequence('postlikes');
    const saveId = await getNextSequence('savedposts');
    const activityTimestamp = nowISO();
    const firstPost = postsInserted[0];

    await postLikesCollection.insertOne({
      LikeID: likeId,
      likeId,
      UserID: demoUser.userId,
      PostID: firstPost.PostID,
      CreatedAt: activityTimestamp,
      createdAt: new Date(activityTimestamp)
    });

    await savedPostsCollection.insertOne({
      SaveID: saveId,
      saveId,
      UserID: demoUser.userId,
      PostID: firstPost.PostID,
      SavedAt: activityTimestamp,
      savedAt: new Date(activityTimestamp)
    });
  }

  console.log('✅ Novelle2 seed complete:');
  console.log(`   Users:             1`);
  console.log(`   Books:             ${booksInserted.length}`);
  console.log(`   Quotes:            ${quotesInserted.length}`);
  console.log(`   Posts:             ${postsInserted.length}`);
  console.log(`   CurrentlyReading:  1`);

  await mongoose.connection.close();
  process.exit(0);
};

seedNovelle2().catch(async (error) => {
  console.error('❌ Seed failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
