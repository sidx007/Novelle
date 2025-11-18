import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  Settings,
  Minus,
  Plus,
} from 'lucide-react';

const Reader = ({ bookTitle = "Sample Book" }) => {
  const viewerRef = useRef(null);
  const [fontSize, setFontSize] = useState(18);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(245); // Mock data

  // Mock content - In production, this would be loaded via epub.js
  const sampleText = `
    It was a bright cold day in April, and the clocks were striking thirteen. 
    Winston Smith, his chin nuzzled into his breast in an effort to escape the 
    vile wind, slipped quickly through the glass doors of Victory Mansions, 
    though not quickly enough to prevent a swirl of gritty dust from entering 
    along with him.

    The hallway smelt of boiled cabbage and old rag mats. At one end of it a 
    coloured poster, too large for indoor display, had been tacked to the wall. 
    It depicted simply an enormous face, more than a metre wide: the face of a 
    man of about forty-five, with a heavy black moustache and ruggedly handsome 
    features.

    Winston made for the stairs. It was no use trying the lift. Even at the 
    best of times it was seldom working, and at present the electric current 
    was cut off during daylight hours. It was part of the economy drive in 
    preparation for Hate Week. The flat was seven flights up, and Winston, 
    who was thirty-nine and had a varicose ulcer above his right ankle, went 
    slowly, resting several times on the way.
  `;

  const increaseFontSize = () => {
    if (fontSize < 28) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Reader Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass sticky top-0 z-10 py-4"
        style={{ borderBottom: '1px solid var(--color-border-light)' }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-2xl font-playfair font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {bookTitle}
              </h2>
              <p
                className="text-sm font-inter mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Font Size Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={decreaseFontSize}
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-secondary)',
                  }}
                  aria-label="Decrease font size"
                >
                  <Minus size={18} />
                </motion.button>

                <span
                  className="font-inter text-sm px-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {fontSize}px
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={increaseFontSize}
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-secondary)',
                  }}
                  aria-label="Increase font size"
                >
                  <Plus size={18} />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn-secondary flex items-center gap-2"
              >
                <BookmarkPlus size={18} />
                Bookmark
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reader Content */}
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          ref={viewerRef}
          className="reading-content glass rounded-2xl p-12 mx-auto"
          style={{
            fontSize: `${fontSize}px`,
            maxWidth: '800px',
            minHeight: '600px',
          }}
        >
          {sampleText.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="mb-6 leading-relaxed"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {paragraph.trim()}
            </p>
          ))}
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevPage}
            disabled={currentPage === 1}
            className="btn-primary flex items-center gap-2"
            style={{
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value))}
              className="w-48"
              style={{
                accentColor: 'var(--color-accent-primary)',
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="btn-primary flex items-center gap-2"
            style={{
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Reader;
