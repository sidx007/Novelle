import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import bookService from '../services/bookService';

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getBookById(bookId);
        if (response?.success) {
          setBook(response.data.book);
          setQuotes(response.data.quotes || []);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--color-accent-primary)' }} />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p className="font-literata text-xl" style={{ color: 'var(--color-text-secondary)' }}>{error || 'Book not found'}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container-custom">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 font-inter"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={18} />
          Back to Discover
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl overflow-hidden shadow-soft"
          >
            <div className="aspect-[3/4] bg-cover bg-center" style={{ backgroundImage: `url(${book.coverImage})` }} />
            <div className="p-6">
              <h1 className="text-3xl font-playfair font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {book.title}
              </h1>
              <p className="font-literata text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {book.author}
              </p>
              {book.genre?.length ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genre.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-inter"
                      style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="space-y-2 text-sm font-inter" style={{ color: 'var(--color-text-muted)' }}>
                {book.publishedDate ? <p>Published: {new Date(book.publishedDate).toLocaleDateString()}</p> : null}
                {book.isbn ? <p>ISBN: {book.isbn}</p> : null}
                {book.pageCount ? <p>Pages: {book.pageCount}</p> : null}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary w-full mt-6 inline-flex items-center justify-center gap-2"
                onClick={() => navigate('/reader', { state: { bookId: book.bookId } })}
              >
                <BookOpen size={18} />
                Open Reader
              </motion.button>
            </div>
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-playfair font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              About this book
            </motion.h2>
            <p className="font-literata text-lg leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              {book.content || 'This book does not yet have a description.'}
            </p>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-playfair font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Highlighted Quotes
            </motion.h3>

            {quotes.length === 0 ? (
              <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>
                No quotes for this book yet. Be the first to add one!
              </p>
            ) : (
              <div className="space-y-6">
                {quotes.map((quote, index) => (
                  <motion.blockquote
                    key={quote.quoteId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-2xl p-6"
                  >
                    <p className="font-literata text-lg italic mb-3" style={{ color: 'var(--color-text-primary)' }}>
                      “{quote.content}”
                    </p>
                    <footer className="flex justify-between items-center font-inter text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{quote.author}</span>
                      {quote.pageNumber ? <span>Page {quote.pageNumber}</span> : null}
                    </footer>
                  </motion.blockquote>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
