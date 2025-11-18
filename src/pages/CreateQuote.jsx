import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import userContentService from '../services/userContentService';

const initialBookState = {
  title: '',
  author: '',
  coverImage: '',
  genre: '',
  pageCount: '',
  description: ''
};

const initialQuoteState = {
  text: '',
  author: '',
  pageNumber: '',
  notes: '',
  isPublic: true
};

const CreateQuote = () => {
  const [book, setBook] = useState(initialBookState);
  const [quote, setQuote] = useState(initialQuoteState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const handleBookChange = (event) => {
    const { name, value } = event.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuoteChange = (event) => {
    const { name, value, type, checked } = event.target;
    setQuote((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setBook(initialBookState);
    setQuote(initialQuoteState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!quote.text.trim() || !book.title.trim() || !book.author.trim()) {
      setFeedback({ type: 'error', message: 'Book title, book author, and quote text are required.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        book: {
          title: book.title.trim(),
          author: book.author.trim(),
          coverImage: book.coverImage?.trim() || undefined,
          description: book.description?.trim() || undefined,
          genre: book.genre?.trim() || undefined,
          pageCount: book.pageCount ? Number(book.pageCount) : undefined
        },
        quote: {
          text: quote.text.trim(),
          author: quote.author?.trim() || book.author.trim(),
          pageNumber: quote.pageNumber ? Number(quote.pageNumber) : undefined,
          notes: quote.notes?.trim() || undefined,
          isPublic: quote.isPublic
        }
      };

      const response = await userContentService.createQuoteWithBook(payload);
      if (response.success) {
        resetForm();
        setFeedback({
          type: 'success',
          message: 'Your quote has been published to the Discover feed.'
        });
        setTimeout(() => navigate('/discover'), 1200);
      } else {
        setFeedback({ type: 'error', message: response.message || 'Unable to publish quote.' });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Unable to publish quote.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl p-8 shadow-xl"
          style={{ border: '1px solid var(--color-border-light)' }}
        >
          <h1 className="text-3xl font-playfair mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Share a Quote
          </h1>
          <p className="font-inter mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Add a quote and the book it belongs to. We will surface it in the Discover feed after it is saved.
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <section>
              <h2 className="text-xl font-literata mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Book Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={book.title}
                    onChange={handleBookChange}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={book.author}
                    onChange={handleBookChange}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="coverImage"
                    value={book.coverImage}
                    onChange={handleBookChange}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Genre or Shelf Tag
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={book.genre}
                    onChange={handleBookChange}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                    placeholder="Fantasy, Memoir, ..."
                  />
                </div>
                <div>
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Page Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="pageCount"
                    value={book.pageCount}
                    onChange={handleBookChange}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={book.description}
                    onChange={handleBookChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-literata mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Quote Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Quote *
                  </label>
                  <textarea
                    name="text"
                    value={quote.text}
                    onChange={handleQuoteChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Quoted By
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={quote.author}
                      onChange={handleQuoteChange}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                        color: 'var(--color-text-primary)'
                      }}
                      placeholder="Defaults to book author"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Page Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="pageNumber"
                      value={quote.pageNumber}
                      onChange={handleQuoteChange}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={quote.notes}
                      onChange={handleQuoteChange}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                        color: 'var(--color-text-primary)'
                      }}
                      placeholder="Why this quote matters"
                    />
                  </div>
                </div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={quote.isPublic}
                    onChange={handleQuoteChange}
                  />
                  <span className="font-inter text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Share publicly on Discover (toggle off to keep it private)
                  </span>
                </label>
              </div>
            </section>

            {feedback ? (
              <div
                className="px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: feedback.type === 'success'
                    ? 'rgba(46, 204, 113, 0.15)'
                    : 'rgba(231, 76, 60, 0.15)',
                  color: feedback.type === 'success'
                    ? 'rgb(46, 204, 113)'
                    : 'rgb(231, 76, 60)'
                }}
              >
                {feedback.message}
              </div>
            ) : null}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="w-full md:w-auto px-6 py-3 rounded-full font-inter font-semibold"
              style={{
                backgroundColor: 'var(--color-accent-primary)',
                color: '#ffffff',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Publishing…' : 'Publish Quote'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuote;
