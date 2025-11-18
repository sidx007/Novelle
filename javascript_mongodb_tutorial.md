# MongoDB Database Access Tutorial - JavaScript

This tutorial demonstrates how to access and interact with the **Novelle** MongoDB database using JavaScript (Node.js).

## Table of Contents
- [Database Setup](#database-setup)
- [Installation](#installation)
- [MongoDB Connection](#mongodb-connection)
- [Collections Overview](#collections-overview)
- [CRUD Operations](#crud-operations)
  - [Users Collection](#users-collection)
  - [UserProfile Collection](#userprofile-collection)
  - [Books Collection](#books-collection)
  - [Quotes Collection](#quotes-collection)
  - [Posts Collection](#posts-collection)
  - [PostLikes Collection](#postlikes-collection)
  - [SavedPosts Collection](#savedposts-collection)
  - [CurrentlyReading Collection](#currentlyreading-collection)
- [Advanced Queries](#advanced-queries)
- [Best Practices](#best-practices)

---

## Database Setup

**Database Name:** `Novelle`

**Connection String:**
```
mongodb+srv://ssharma16be23_db_user:RvtL8DefSS0BldXE@cluster0.w3h3zqt.mongodb.net/?appName=Cluster0
```

**Collections:**
- `users` - User accounts
- `userprofile` - User profile information
- `books` - Book catalog
- `quotes` - Book quotes
- `posts` - User posts
- `postlikes` - Post likes
- `savedposts` - Saved posts
- `currentlyreading` - Currently reading books

---

## Installation

Install the MongoDB Node.js driver:

```bash
npm install mongodb
```

Or if you're using Yarn:

```bash
yarn add mongodb
```

---

## MongoDB Connection

### Basic Connection Setup

```javascript
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://ssharma16be23_db_user:RvtL8DefSS0BldXE@cluster0.w3h3zqt.mongodb.net/?appName=Cluster0";

// Create a new MongoClient
const client = new MongoClient(uri);

// Database name
const dbName = "Novelle";

async function connectToDatabase() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected successfully to MongoDB");
        
        // Get database instance
        const db = client.db(dbName);
        
        // List all databases
        const databasesList = await client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        
        return db;
    } catch (error) {
        console.error("Connection error:", error);
        throw error;
    }
}

// Close connection when done
async function closeConnection() {
    await client.close();
    console.log("Connection closed");
}
```

### Using Environment Variables (Recommended)

Create a `.env` file:
```
MONGODB_URI=mongodb+srv://ssharma16be23_db_user:RvtL8DefSS0BldXE@cluster0.w3h3zqt.mongodb.net/?appName=Cluster0
DB_NAME=Novelle
```

Then in your code:
```javascript
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
```

---

## Collections Overview

### Database Schema

```javascript
// Get all collection references
const db = client.db("Novelle");

const collections = {
    users: db.collection('users'),
    userprofile: db.collection('userprofile'),
    books: db.collection('books'),
    quotes: db.collection('quotes'),
    posts: db.collection('posts'),
    postlikes: db.collection('postlikes'),
    savedposts: db.collection('savedposts'),
    currentlyreading: db.collection('currentlyreading')
};
```

---

## CRUD Operations

### Users Collection

**Schema:**
```javascript
{
    UserID: Number,
    Email: String,
    Name: String,
    CreatedAt: String (ISO 8601 format)
}
```

**Create a User:**
```javascript
async function createUser(userData) {
    const db = client.db("Novelle");
    const users = db.collection('users');
    
    const newUser = {
        UserID: userData.UserID,
        Email: userData.Email,
        Name: userData.Name,
        CreatedAt: new Date().toISOString()
    };
    
    const result = await users.insertOne(newUser);
    console.log(`User created with ID: ${result.insertedId}`);
    return result;
}

// Usage
await createUser({
    UserID: 2,
    Email: "jane@example.com",
    Name: "Jane Smith"
});
```

**Read Users:**
```javascript
// Get all users
async function getAllUsers() {
    const db = client.db("Novelle");
    const users = db.collection('users');
    return await users.find({}).toArray();
}

// Get user by UserID
async function getUserById(userId) {
    const db = client.db("Novelle");
    const users = db.collection('users');
    return await users.findOne({ UserID: userId });
}

// Get user by Email
async function getUserByEmail(email) {
    const db = client.db("Novelle");
    const users = db.collection('users');
    return await users.findOne({ Email: email });
}
```

**Update User:**
```javascript
async function updateUser(userId, updates) {
    const db = client.db("Novelle");
    const users = db.collection('users');
    
    const result = await users.updateOne(
        { UserID: userId },
        { $set: updates }
    );
    
    console.log(`${result.modifiedCount} document(s) updated`);
    return result;
}

// Usage
await updateUser(1, { Name: "John Updated", Email: "newemail@example.com" });
```

**Delete User:**
```javascript
async function deleteUser(userId) {
    const db = client.db("Novelle");
    const users = db.collection('users');
    
    const result = await users.deleteOne({ UserID: userId });
    console.log(`${result.deletedCount} document(s) deleted`);
    return result;
}
```

---

### UserProfile Collection

**Schema:**
```javascript
{
    ProfileID: Number,
    UserID: Number,
    Bio: String,
    ProfilePicture: String,
    JoinedDate: String (YYYY-MM-DD),
    LastActive: String (ISO 8601 format)
}
```

**Create Profile:**
```javascript
async function createUserProfile(profileData) {
    const db = client.db("Novelle");
    const userprofile = db.collection('userprofile');
    
    const newProfile = {
        ProfileID: profileData.ProfileID,
        UserID: profileData.UserID,
        Bio: profileData.Bio || "",
        ProfilePicture: profileData.ProfilePicture || "",
        JoinedDate: new Date().toISOString().split('T')[0],
        LastActive: new Date().toISOString()
    };
    
    const result = await userprofile.insertOne(newProfile);
    return result;
}
```

**Get Profile by UserID:**
```javascript
async function getProfileByUserId(userId) {
    const db = client.db("Novelle");
    const userprofile = db.collection('userprofile');
    return await userprofile.findOne({ UserID: userId });
}
```

**Update Last Active:**
```javascript
async function updateLastActive(userId) {
    const db = client.db("Novelle");
    const userprofile = db.collection('userprofile');
    
    const result = await userprofile.updateOne(
        { UserID: userId },
        { $set: { LastActive: new Date().toISOString() } }
    );
    return result;
}
```

---

### Books Collection

**Schema:**
```javascript
{
    BookID: Number,
    Title: String,
    Author: String,
    Content: String,
    PublishedDate: String (YYYY-MM-DD),
    ISBN: String,
    CreatedAt: String (ISO 8601 format)
}
```

**Create Book:**
```javascript
async function createBook(bookData) {
    const db = client.db("Novelle");
    const books = db.collection('books');
    
    const newBook = {
        BookID: bookData.BookID,
        Title: bookData.Title,
        Author: bookData.Author,
        Content: bookData.Content || "",
        PublishedDate: bookData.PublishedDate,
        ISBN: bookData.ISBN,
        CreatedAt: new Date().toISOString()
    };
    
    const result = await books.insertOne(newBook);
    return result;
}
```

**Search Books:**
```javascript
// Search by title
async function searchBooksByTitle(title) {
    const db = client.db("Novelle");
    const books = db.collection('books');
    return await books.find({ 
        Title: { $regex: title, $options: 'i' } 
    }).toArray();
}

// Search by author
async function searchBooksByAuthor(author) {
    const db = client.db("Novelle");
    const books = db.collection('books');
    return await books.find({ 
        Author: { $regex: author, $options: 'i' } 
    }).toArray();
}

// Get book by ISBN
async function getBookByISBN(isbn) {
    const db = client.db("Novelle");
    const books = db.collection('books');
    return await books.findOne({ ISBN: isbn });
}
```

---

### Quotes Collection

**Schema:**
```javascript
{
    QuoteID: Number,
    BookID: Number,
    QuoteContent: String,
    PageNumber: Number,
    CreatedAt: String (ISO 8601 format)
}
```

**Create Quote:**
```javascript
async function createQuote(quoteData) {
    const db = client.db("Novelle");
    const quotes = db.collection('quotes');
    
    const newQuote = {
        QuoteID: quoteData.QuoteID,
        BookID: quoteData.BookID,
        QuoteContent: quoteData.QuoteContent,
        PageNumber: quoteData.PageNumber,
        CreatedAt: new Date().toISOString()
    };
    
    const result = await quotes.insertOne(newQuote);
    return result;
}
```

**Get Quotes by BookID:**
```javascript
async function getQuotesByBook(bookId) {
    const db = client.db("Novelle");
    const quotes = db.collection('quotes');
    return await quotes.find({ BookID: bookId }).toArray();
}
```

**Search Quotes:**
```javascript
async function searchQuotes(searchText) {
    const db = client.db("Novelle");
    const quotes = db.collection('quotes');
    return await quotes.find({ 
        QuoteContent: { $regex: searchText, $options: 'i' } 
    }).toArray();
}
```

---

### Posts Collection

**Schema:**
```javascript
{
    PostID: Number,
    UserID: Number,
    Title: String,
    BookID: Number,
    QuoteID: Number,
    PhotoLink: String,
    Views: Number,
    CreatedAt: String (ISO 8601 format),
    UpdatedAt: String (ISO 8601 format)
}
```

**Create Post:**
```javascript
async function createPost(postData) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    
    const newPost = {
        PostID: postData.PostID,
        UserID: postData.UserID,
        Title: postData.Title,
        BookID: postData.BookID,
        QuoteID: postData.QuoteID,
        PhotoLink: postData.PhotoLink || "",
        Views: 0,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
    };
    
    const result = await posts.insertOne(newPost);
    return result;
}
```

**Get Posts:**
```javascript
// Get all posts by a user
async function getPostsByUser(userId) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    return await posts.find({ UserID: userId })
        .sort({ CreatedAt: -1 })
        .toArray();
}

// Get post by ID
async function getPostById(postId) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    return await posts.findOne({ PostID: postId });
}

// Get recent posts
async function getRecentPosts(limit = 10) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    return await posts.find({})
        .sort({ CreatedAt: -1 })
        .limit(limit)
        .toArray();
}
```

**Increment Post Views:**
```javascript
async function incrementPostViews(postId) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    
    const result = await posts.updateOne(
        { PostID: postId },
        { $inc: { Views: 1 } }
    );
    return result;
}
```

---

### PostLikes Collection

**Schema:**
```javascript
{
    LikeID: Number,
    UserID: Number,
    PostID: Number,
    CreatedAt: String (ISO 8601 format)
}
```

**Like a Post:**
```javascript
async function likePost(userId, postId, likeId) {
    const db = client.db("Novelle");
    const postlikes = db.collection('postlikes');
    
    // Check if already liked
    const existingLike = await postlikes.findOne({ 
        UserID: userId, 
        PostID: postId 
    });
    
    if (existingLike) {
        return { success: false, message: "Post already liked" };
    }
    
    const newLike = {
        LikeID: likeId,
        UserID: userId,
        PostID: postId,
        CreatedAt: new Date().toISOString()
    };
    
    const result = await postlikes.insertOne(newLike);
    return { success: true, result };
}
```

**Unlike a Post:**
```javascript
async function unlikePost(userId, postId) {
    const db = client.db("Novelle");
    const postlikes = db.collection('postlikes');
    
    const result = await postlikes.deleteOne({ 
        UserID: userId, 
        PostID: postId 
    });
    return result;
}
```

**Get Post Likes Count:**
```javascript
async function getPostLikesCount(postId) {
    const db = client.db("Novelle");
    const postlikes = db.collection('postlikes');
    return await postlikes.countDocuments({ PostID: postId });
}
```

**Check if User Liked Post:**
```javascript
async function hasUserLikedPost(userId, postId) {
    const db = client.db("Novelle");
    const postlikes = db.collection('postlikes');
    const like = await postlikes.findOne({ 
        UserID: userId, 
        PostID: postId 
    });
    return like !== null;
}
```

---

### SavedPosts Collection

**Schema:**
```javascript
{
    SaveID: Number,
    UserID: Number,
    PostID: Number,
    SavedAt: String (ISO 8601 format)
}
```

**Save a Post:**
```javascript
async function savePost(userId, postId, saveId) {
    const db = client.db("Novelle");
    const savedposts = db.collection('savedposts');
    
    // Check if already saved
    const existingSave = await savedposts.findOne({ 
        UserID: userId, 
        PostID: postId 
    });
    
    if (existingSave) {
        return { success: false, message: "Post already saved" };
    }
    
    const newSave = {
        SaveID: saveId,
        UserID: userId,
        PostID: postId,
        SavedAt: new Date().toISOString()
    };
    
    const result = await savedposts.insertOne(newSave);
    return { success: true, result };
}
```

**Unsave a Post:**
```javascript
async function unsavePost(userId, postId) {
    const db = client.db("Novelle");
    const savedposts = db.collection('savedposts');
    
    const result = await savedposts.deleteOne({ 
        UserID: userId, 
        PostID: postId 
    });
    return result;
}
```

**Get Saved Posts:**
```javascript
async function getSavedPosts(userId) {
    const db = client.db("Novelle");
    const savedposts = db.collection('savedposts');
    return await savedposts.find({ UserID: userId })
        .sort({ SavedAt: -1 })
        .toArray();
}
```

---

### CurrentlyReading Collection

**Schema:**
```javascript
{
    ReadingID: Number,
    UserID: Number,
    BookID: Number,
    StartDate: String (YYYY-MM-DD),
    Progress: Number,
    LastUpdated: String (ISO 8601 format)
}
```

**Start Reading a Book:**
```javascript
async function startReading(readingData) {
    const db = client.db("Novelle");
    const currentlyreading = db.collection('currentlyreading');
    
    const newReading = {
        ReadingID: readingData.ReadingID,
        UserID: readingData.UserID,
        BookID: readingData.BookID,
        StartDate: new Date().toISOString().split('T')[0],
        Progress: 0,
        LastUpdated: new Date().toISOString()
    };
    
    const result = await currentlyreading.insertOne(newReading);
    return result;
}
```

**Update Reading Progress:**
```javascript
async function updateProgress(userId, bookId, progress) {
    const db = client.db("Novelle");
    const currentlyreading = db.collection('currentlyreading');
    
    const result = await currentlyreading.updateOne(
        { UserID: userId, BookID: bookId },
        { 
            $set: { 
                Progress: progress,
                LastUpdated: new Date().toISOString()
            } 
        }
    );
    return result;
}
```

**Get Currently Reading Books:**
```javascript
async function getCurrentlyReading(userId) {
    const db = client.db("Novelle");
    const currentlyreading = db.collection('currentlyreading');
    return await currentlyreading.find({ UserID: userId }).toArray();
}
```

**Finish Reading a Book:**
```javascript
async function finishReading(userId, bookId) {
    const db = client.db("Novelle");
    const currentlyreading = db.collection('currentlyreading');
    
    const result = await currentlyreading.deleteOne({ 
        UserID: userId, 
        BookID: bookId 
    });
    return result;
}
```

---

## Advanced Queries

### Aggregation Pipeline Examples

**Get User with Full Profile:**
```javascript
async function getUserWithProfile(userId) {
    const db = client.db("Novelle");
    const users = db.collection('users');
    
    const result = await users.aggregate([
        { $match: { UserID: userId } },
        {
            $lookup: {
                from: 'userprofile',
                localField: 'UserID',
                foreignField: 'UserID',
                as: 'profile'
            }
        },
        { $unwind: '$profile' }
    ]).toArray();
    
    return result[0];
}
```

**Get Post with Complete Details:**
```javascript
async function getPostWithDetails(postId) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    
    const result = await posts.aggregate([
        { $match: { PostID: postId } },
        {
            $lookup: {
                from: 'users',
                localField: 'UserID',
                foreignField: 'UserID',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'books',
                localField: 'BookID',
                foreignField: 'BookID',
                as: 'book'
            }
        },
        {
            $lookup: {
                from: 'quotes',
                localField: 'QuoteID',
                foreignField: 'QuoteID',
                as: 'quote'
            }
        },
        {
            $lookup: {
                from: 'postlikes',
                localField: 'PostID',
                foreignField: 'PostID',
                as: 'likes'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$quote', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                likesCount: { $size: '$likes' }
            }
        }
    ]).toArray();
    
    return result[0];
}
```

**Get Most Popular Posts:**
```javascript
async function getMostPopularPosts(limit = 10) {
    const db = client.db("Novelle");
    const posts = db.collection('posts');
    
    return await posts.aggregate([
        {
            $lookup: {
                from: 'postlikes',
                localField: 'PostID',
                foreignField: 'PostID',
                as: 'likes'
            }
        },
        {
            $addFields: {
                likesCount: { $size: '$likes' }
            }
        },
        { $sort: { likesCount: -1, Views: -1 } },
        { $limit: limit }
    ]).toArray();
}
```

**Get User Statistics:**
```javascript
async function getUserStatistics(userId) {
    const db = client.db("Novelle");
    
    // Count posts
    const postsCount = await db.collection('posts')
        .countDocuments({ UserID: userId });
    
    // Count likes received
    const userPosts = await db.collection('posts')
        .find({ UserID: userId })
        .project({ PostID: 1 })
        .toArray();
    
    const postIds = userPosts.map(p => p.PostID);
    const likesCount = await db.collection('postlikes')
        .countDocuments({ PostID: { $in: postIds } });
    
    // Count saved posts
    const savedCount = await db.collection('savedposts')
        .countDocuments({ UserID: userId });
    
    // Count currently reading
    const readingCount = await db.collection('currentlyreading')
        .countDocuments({ UserID: userId });
    
    return {
        postsCount,
        likesReceived: likesCount,
        savedPostsCount: savedCount,
        booksReading: readingCount
    };
}
```

---

## Best Practices

### 1. Connection Management

Always use a single client instance and reuse it:

```javascript
// db.js - Database connection module
const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connect() {
    if (db) return db;
    
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    
    await client.connect();
    db = client.db("Novelle");
    
    return db;
}

async function getDb() {
    if (!db) {
        await connect();
    }
    return db;
}

async function close() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}

module.exports = { connect, getDb, close };
```

Usage:
```javascript
const { getDb } = require('./db');

async function someFunction() {
    const db = await getDb();
    const users = db.collection('users');
    // ... perform operations
}
```

### 2. Error Handling

Always wrap database operations in try-catch:

```javascript
async function safeGetUser(userId) {
    try {
        const db = await getDb();
        const users = db.collection('users');
        const user = await users.findOne({ UserID: userId });
        return { success: true, data: user };
    } catch (error) {
        console.error('Error getting user:', error);
        return { success: false, error: error.message };
    }
}
```

### 3. Input Validation

Validate inputs before database operations:

```javascript
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function createUserSafe(userData) {
    if (!validateEmail(userData.Email)) {
        throw new Error('Invalid email format');
    }
    
    if (!userData.Name || userData.Name.trim().length === 0) {
        throw new Error('Name is required');
    }
    
    // Proceed with creation
    return await createUser(userData);
}
```

### 4. Pagination

Implement pagination for large result sets:

```javascript
async function getPostsPaginated(page = 1, limit = 20) {
    const db = await getDb();
    const posts = db.collection('posts');
    
    const skip = (page - 1) * limit;
    
    const results = await posts.find({})
        .sort({ CreatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
    
    const total = await posts.countDocuments({});
    
    return {
        data: results,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    };
}
```

### 5. Indexing

Create indexes for better query performance:

```javascript
async function createIndexes() {
    const db = await getDb();
    
    // Users indexes
    await db.collection('users').createIndex({ Email: 1 }, { unique: true });
    await db.collection('users').createIndex({ UserID: 1 }, { unique: true });
    
    // Posts indexes
    await db.collection('posts').createIndex({ UserID: 1 });
    await db.collection('posts').createIndex({ BookID: 1 });
    await db.collection('posts').createIndex({ CreatedAt: -1 });
    
    // Books indexes
    await db.collection('books').createIndex({ ISBN: 1 }, { unique: true });
    await db.collection('books').createIndex({ Title: 'text', Author: 'text' });
    
    console.log('Indexes created successfully');
}
```

### 6. Complete Example Application

```javascript
// app.js - Complete example
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://ssharma16be23_db_user:RvtL8DefSS0BldXE@cluster0.w3h3zqt.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");
        
        const db = client.db("Novelle");
        
        // Example: Get all users
        const users = await db.collection('users').find({}).toArray();
        console.log("Users:", users);
        
        // Example: Create a new post
        const newPost = {
            PostID: Date.now(), // Simple ID generation
            UserID: 1,
            Title: "Amazing Quote",
            BookID: 1,
            QuoteID: 1,
            PhotoLink: "https://example.com/photo.jpg",
            Views: 0,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString()
        };
        
        await db.collection('posts').insertOne(newPost);
        console.log("Post created");
        
        // Example: Get post with details using aggregation
        const postDetails = await db.collection('posts').aggregate([
            { $match: { PostID: newPost.PostID } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'UserID',
                    foreignField: 'UserID',
                    as: 'author'
                }
            },
            { $unwind: '$author' }
        ]).toArray();
        
        console.log("Post with details:", postDetails[0]);
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

// Run the application
main();
```

---

## Summary

This tutorial covers:
- ✅ MongoDB connection setup with authentication
- ✅ All 8 collections in the Novelle database
- ✅ Complete CRUD operations for each collection
- ✅ Advanced queries using aggregation pipelines
- ✅ Best practices for production applications
- ✅ Error handling and validation
- ✅ Connection management and optimization

For more information, refer to the [MongoDB Node.js Driver Documentation](https://www.mongodb.com/docs/drivers/node/current/).
