import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import QuoteCard from './QuoteCard';
import { Loader2 } from 'lucide-react';
import quoteService from '../services/quoteService';

// Mock data - Fallback if API fails
const mockQuotes = [
  {
    id: 1,
    quote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    author: "Jane Austen",
    book: "Pride and Prejudice",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    quote: "The only way out of the labyrinth of suffering is to forgive.",
    author: "John Green",
    book: "Looking for Alaska",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    quote: "It does not do to dwell on dreams and forget to live.",
    author: "J.K. Rowling",
    book: "Harry Potter and the Philosopher's Stone",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    quote: "I am no bird; and no net ensnares me: I am a free human being with an independent will.",
    author: "Charlotte Brontë",
    book: "Jane Eyre",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    quote: "So we beat on, boats against the current, borne back ceaselessly into the past.",
    author: "F. Scott Fitzgerald",
    book: "The Great Gatsby",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    quote: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien",
    book: "The Fellowship of the Ring",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    quote: "It was the best of times, it was the worst of times.",
    author: "Charles Dickens",
    book: "A Tale of Two Cities",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    quote: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    book: "Self-Reliance",
    cover: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=300&fit=crop"
  },
];

const QuoteFeed = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Fetch quotes from API
  const fetchQuotes = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await quoteService.getAllQuotes(pageNum, 10);
      
      if (response.success && response.data) {
        if (pageNum === 1) {
          setQuotes(response.data);
        } else {
          setQuotes(prev => [...prev, ...response.data]);
        }
        setTotalPages(response.pagination.pages);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quotes. Using sample data.');
      // Fallback to mock data on error
      if (pageNum === 1) {
        setQuotes(mockQuotes);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(1);
  }, []);

  const loadMore = () => {
    if (page < totalPages) {
      fetchQuotes(page + 1);
    }
  };

  if (loading && quotes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={48} style={{ color: 'var(--color-accent-primary)' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2
          className="text-5xl font-playfair font-semibold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Discover Quotes
        </h2>
        <p
          className="text-lg font-literata max-w-2xl mx-auto"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Explore beautiful passages from beloved books. Each quote is a window
          into a different world.
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-accent)',
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Quote Scroll */}
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {quotes.map((quote, index) => (
          <QuoteCard 
            key={quote._id || quote.id} 
            quote={quote.text || quote.quote}
            author={quote.bookId?.author || quote.author}
            book={quote.bookId?.title || quote.book}
            cover={quote.bookId?.coverImage || quote.cover}
            index={index} 
          />
        ))}
      </div>

      {/* Load More Button */}
      {page < totalPages && (
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            className="btn-primary px-8 py-3"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Loading...
              </span>
            ) : (
              'Load More Quotes'
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default QuoteFeed;
