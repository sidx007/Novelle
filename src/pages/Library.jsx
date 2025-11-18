import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Star } from 'lucide-react';

const mockBooks = [
  {
    id: 1,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    rating: 4.9,
    pages: 432,
  },
  {
    id: 2,
    title: 'Looking for Alaska',
    author: 'John Green',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    rating: 4.5,
    pages: 221,
  },
  {
    id: 3,
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    rating: 4.8,
    pages: 309,
  },
  {
    id: 4,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    rating: 4.7,
    pages: 532,
  },
  {
    id: 5,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop',
    rating: 4.6,
    pages: 180,
  },
  {
    id: 6,
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop',
    rating: 4.9,
    pages: 423,
  },
  {
    id: 7,
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    cover: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop',
    rating: 4.4,
    pages: 448,
  },
  {
    id: 8,
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    cover: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&h=450&fit=crop',
    rating: 4.3,
    pages: 416,
  },
];

const Library = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredBooks = mockBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-6xl font-playfair font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Your Library
          </h1>
          <p
            className="text-xl font-literata max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Your personal collection of literary treasures
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: 'var(--color-text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl font-inter glass border-none focus:outline-none focus:ring-2"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border-light)',
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['All', 'Reading', 'Completed', 'Wishlist'].map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.toLowerCase())}
                  className="px-4 py-2 rounded-lg font-inter text-sm flex items-center gap-2"
                  style={{
                    backgroundColor:
                      selectedFilter === filter.toLowerCase()
                        ? 'var(--color-accent-primary)'
                        : 'var(--color-bg-secondary)',
                    color:
                      selectedFilter === filter.toLowerCase()
                        ? 'var(--color-bg-primary)'
                        : 'var(--color-text-secondary)',
                  }}
                >
                  {filter === 'All' && <Filter size={16} />}
                  {filter}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/reader')}
              className="glass rounded-xl overflow-hidden cursor-pointer shadow-soft card-hover"
            >
              {/* Book Cover */}
              <div className="relative overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-72 object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <BookOpen size={18} />
                    Read Now
                  </motion.button>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3
                  className="font-playfair font-semibold text-lg mb-1 line-clamp-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {book.title}
                </h3>
                <p
                  className="font-inter text-sm mb-3"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {book.author}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      fill="var(--color-accent-primary)"
                      style={{ color: 'var(--color-accent-primary)' }}
                    />
                    <span
                      className="font-inter text-sm font-medium"
                      style={{ color: 'var(--color-text-accent)' }}
                    >
                      {book.rating}
                    </span>
                  </div>
                  <span
                    className="font-inter text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {book.pages} pages
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3
              className="text-2xl font-playfair font-semibold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              No books found
            </h3>
            <p
              className="font-literata"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Library;
