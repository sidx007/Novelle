# 🗄️ MongoDB Database Setup Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [MongoDB Setup](#mongodb-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Backend](#running-the-backend)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Connecting Frontend to Backend](#connecting-frontend-to-backend)

---

## Prerequisites

Before connecting your database, make sure you have:

1. **Node.js** installed (v16 or higher)
2. **MongoDB** installed locally OR a **MongoDB Atlas** account (cloud)
3. **npm** or **yarn** package manager

---

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB**:
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb-community
   ```

2. **Verify MongoDB is running**:
   ```bash
   mongo --version
   ```

3. **Your connection string will be**:
   ```
   mongodb://localhost:27017/novelle
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/novelle
   ```

---

## Environment Configuration

### 1. Backend Environment (`.env` file)

The `.env` file is already created in your project root. Update it with your MongoDB connection:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/novelle
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novelle

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 2. Frontend Environment (`.env.local` file)

Already created. Make sure it points to your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Backend

### 1. Start MongoDB (if using local)

```bash
# macOS/Linux
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

### 2. Start the Backend Server

```bash
# Terminal 1 - Backend Server
npm run server
```

You should see:
```
✅ MongoDB Connected: localhost
📚 Database: novelle
🚀 Server running on port 5000
```

### 3. Start the Frontend (in another terminal)

```bash
# Terminal 2 - Frontend
npm run dev
```

---

## Database Structure

Your database includes these collections:

### Collections Created:

1. **users** - User accounts
   - Fields: username, email, password, createdAt, updatedAt

2. **userprofiles** - Extended user info
   - Fields: userId, displayName, bio, profilePicture, favoriteGenres, readingGoal, booksRead

3. **books** - Book catalog
   - Fields: title, author, isbn, coverImage, description, publishedYear, genre, pageCount, rating

4. **quotes** - Book quotes
   - Fields: bookId, text, pageNumber, chapter, addedBy, likes, isPublic

5. **posts** - User posts
   - Fields: userId, quoteId, content, type, likesCount, commentsCount

6. **postlikes** - Post likes tracking
   - Fields: postId, userId

7. **savedposts** - Saved posts
   - Fields: userId, postId

8. **currentlyreading** - Reading progress
   - Fields: userId, bookId, progress (currentPage, totalPages, percentage), status, notes

---

## API Endpoints

### Quotes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotes` | Get all public quotes (paginated) |
| GET | `/api/quotes/:id` | Get single quote by ID |
| GET | `/api/quotes/book/:bookId` | Get quotes for a book |
| POST | `/api/quotes` | Create new quote |
| PUT | `/api/quotes/:id` | Update quote |
| DELETE | `/api/quotes/:id` | Delete quote |
| POST | `/api/quotes/:id/like` | Like a quote |

**Example Request**:
```bash
# Get quotes
curl http://localhost:5000/api/quotes?page=1&limit=10

# Create quote
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "book_id_here",
    "text": "Your quote text",
    "addedBy": "user_id_here",
    "isPublic": true
  }'
```

### Books API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (paginated, searchable) |
| GET | `/api/books/:id` | Get single book by ID |
| POST | `/api/books` | Create new book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |

**Example Request**:
```bash
# Search books
curl http://localhost:5000/api/books?search=pride&genre=classics

# Create book
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "genre": ["Classic", "Romance"],
    "publishedYear": 1813,
    "pageCount": 432
  }'
```

---

## Connecting Frontend to Backend

### The frontend is already configured! Here's how it works:

### 1. API Service (`src/services/`)

Three service files handle API calls:

- `api.js` - Base axios configuration
- `quoteService.js` - All quote API calls
- `bookService.js` - All book API calls

### 2. Using in Components

The `QuoteFeed` component is already updated to use real data:

```jsx
import quoteService from '../services/quoteService';

// Fetch quotes
const response = await quoteService.getAllQuotes(page, 10);
setQuotes(response.data);
```

### 3. Fallback to Mock Data

If the API is unavailable, the app automatically falls back to mock data so it still works!

---

## Testing the Connection

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Novelle API is running",
  "timestamp": "2025-11-17T..."
}
```

### 2. Add Sample Data

Create a file `server/seed.js` to populate initial data:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import Book from './models/Book.js';
import Quote from './models/Quote.js';

dotenv.config();
connectDB();

const sampleBooks = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: ["Classic", "Romance"],
    publishedYear: 1813,
    pageCount: 432,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
  }
];

const seedDatabase = async () => {
  try {
    await Book.deleteMany({});
    await Quote.deleteMany({});
    
    const books = await Book.insertMany(sampleBooks);
    console.log('✅ Books added:', books.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();
```

Run it:
```bash
node server/seed.js
```

---

## Troubleshooting

### Issue: "MongoDB Connection Error"

**Solution**:
1. Check if MongoDB is running: `brew services list`
2. Verify connection string in `.env`
3. For Atlas: Check whitelist IP (allow all: 0.0.0.0/0)

### Issue: "CORS Error"

**Solution**:
- Make sure `CLIENT_URL` in `.env` matches your frontend URL
- Backend already has CORS configured

### Issue: "Cannot GET /api/quotes"

**Solution**:
1. Make sure backend server is running on port 5000
2. Check `VITE_API_URL` in `.env.local`
3. Restart both servers

---

## Next Steps

1. ✅ Start MongoDB
2. ✅ Configure `.env` with your connection string
3. ✅ Run `npm run server` (backend)
4. ✅ Run `npm run dev` (frontend)
5. ✅ Add sample data using seed script
6. ✅ Visit http://localhost:5173 and see real data!

---

## Additional Features to Implement

Once basic connection works, you can add:

- [ ] User authentication (JWT)
- [ ] User profiles and saved quotes
- [ ] Reading progress tracking
- [ ] Social features (posts, likes, comments)
- [ ] Image upload for book covers
- [ ] Search and filtering
- [ ] Pagination improvements

---

**Need help?** Check the console logs:
- Backend: Terminal running `npm run server`
- Frontend: Browser console (F12)
- MongoDB: `mongod` logs

**Your database is ready to use!** 🎉
