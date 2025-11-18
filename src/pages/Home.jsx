import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Heart } from 'lucide-react';
import QuoteFeed from '../components/QuoteFeed';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
        }}
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles
                  size={24}
                  style={{ color: 'var(--color-accent-primary)' }}
                />
                <span
                  className="font-inter text-sm uppercase tracking-wide"
                  style={{ color: 'var(--color-accent-primary)' }}
                >
                  Welcome to Novelle
                </span>
              </div>

              <h1
                className="text-6xl lg:text-7xl font-playfair font-bold mb-6 leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Your Cozy Reading Nook
              </h1>

              <p
                className="text-xl font-literata mb-8 leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Discover beautiful quotes, build your personal library, and
                immerse yourself in the timeless art of reading. A warm corner
                of the internet for book lovers.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/library')}
                  className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
                >
                  Explore Library
                  <ArrowRight size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <div
                className="glass rounded-3xl p-8 shadow-soft-lg"
                style={{
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop"
                  alt="Stack of books"
                  className="rounded-2xl w-full h-auto shadow-soft-md"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-glow"
              >
                <BookOpen
                  size={32}
                  style={{ color: 'var(--color-accent-primary)' }}
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 shadow-glow"
              >
                <Heart
                  size={32}
                  style={{ color: 'var(--color-accent-primary)' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Background */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </motion.section>
    </div>
  );
};

export default Home;
