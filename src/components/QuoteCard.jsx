import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Heart } from 'lucide-react';

const QuoteCard = ({ quote, author, book, cover, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="glass rounded-xl p-6 card-hover cursor-pointer"
      style={{
        borderRadius: 'var(--radius-xl)',
      }}
      onClick={() => navigate('/reader')}
    >
      {/* Book Cover */}
      {cover && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={cover}
            alt={book}
            className="w-full h-48 object-cover"
            style={{ borderRadius: 'var(--radius-md)' }}
          />
        </div>
      )}

      {/* Quote Text */}
      <blockquote className="mb-4">
        <p
          className="quote-text mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          "{quote}"
        </p>
        <footer className="flex flex-col gap-1">
          <cite
            className="quote-author not-italic"
            style={{ color: 'var(--color-text-accent)' }}
          >
            — {author}
          </cite>
          {book && (
            <span
              className="font-inter text-sm flex items-center gap-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <BookMarked size={14} />
              {book}
            </span>
          )}
        </footer>
      </blockquote>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-4 border-t"
        style={{ borderColor: 'var(--color-border-light)' }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-inter text-sm"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Heart size={16} />
          Save
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn-primary text-sm"
        >
          Read More
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuoteCard;
