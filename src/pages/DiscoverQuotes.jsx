import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, BookMarked, BookOpen, ChevronUp, ChevronDown, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import postService from '../services/postService';

const DiscoverQuotes = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const shufflePosts = (list) => {
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts from API...');
        const response = await postService.getAllPosts(1, 50);
        console.log('API Response:', response);
        
        if (response.success && response.data && response.data.length > 0) {
          const formattedPosts = response.data.map((post, index) => {
            const fallbackCover = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop';
            const hasBook = Boolean(post.book?.title);
            const rawQuoteKey = post.quote?.quoteId ?? post.quoteId ?? post.quoteDetails?.quoteId ?? post.meta?.quoteId ?? post.postId ?? post.postObjectId ?? index;
            const quoteKey = rawQuoteKey !== undefined && rawQuoteKey !== null ? rawQuoteKey.toString() : `post-${index}`;
            const interactions = {
              likesCount: post.interactions?.likesCount ?? 0,
              savesCount: post.interactions?.savesCount ?? 0,
              likedByUser: post.interactions?.likedByUser ?? false,
              savedByUser: post.interactions?.savedByUser ?? false
            };

            return {
              id: post.postId || post.postObjectId?.toString() || `post-${index}`,
              quoteText: post.quote?.content || post.quoteText || post.postTitle || post.Title || 'Untitled Post',
              bookTitle: post.book?.title || null,
              bookAuthor: post.book?.author || post.quote?.author || post.user?.name || 'Anonymous',
              coverImage: post.book?.coverImage || post.photoLink || fallbackCover,
              userName: post.user?.name || 'Anonymous',
              type: post.type || post.postType || post.Type || (post.quote?.content ? 'Quote' : hasBook ? 'Quote' : 'Post'),
              createdAt: post.createdAt || post.CreatedAt || new Date().toISOString(),
              meta: {
                views: post.views || post.Views || 0,
                quoteId: post.quoteId || post.quoteDetails?.quoteId || post.quote?.quoteId,
                bookId: post.bookId || post.book?.bookId || post.quote?.bookId,
                userId: post.userId || post.user?.userId,
                quoteKey
              },
              interactions
            };
          });

          const shuffledPosts = shufflePosts(formattedPosts);
          console.log('Setting formatted posts:', shuffledPosts.length);
          setPosts(shuffledPosts);
        } else {
          console.log('No posts found in response');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        goToNext();
      } else if (e.deltaY < 0) {
        goToPrevious();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToNext = () => {
    if (currentIndex < posts.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
      setShowInstructions(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
      setShowInstructions(false);
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login', { replace: false, state: { from: '/discover' } });
      return false;
    }
    return true;
  };

  const updatePostInteractions = (index, updater) => {
    setPosts((prev) => prev.map((item, idx) => {
      if (idx !== index) return item;
      const nextInteractions = typeof updater === 'function' ? updater(item.interactions || {}) : updater;
      return {
        ...item,
        interactions: {
          likesCount: nextInteractions.likesCount ?? 0,
          savesCount: nextInteractions.savesCount ?? 0,
          likedByUser: nextInteractions.likedByUser ?? false,
          savedByUser: nextInteractions.savedByUser ?? false
        }
      };
    }));
  };

  const handleLikeToggle = async () => {
    const currentPost = posts[currentIndex];
    if (!currentPost) return;

    if (!requireAuth()) return;

    const quoteKey = currentPost.meta?.quoteKey;
    if (!quoteKey) return;

    try {
      const response = currentPost.interactions?.likedByUser
        ? await postService.unlikeQuote(quoteKey)
        : await postService.likeQuote(quoteKey);

      if (response.success && response.data) {
        updatePostInteractions(currentIndex, response.data);
      }
    } catch (error) {
      console.error('Like toggle failed:', error);
    }
  };

  const handleSaveToggle = async () => {
    const currentPost = posts[currentIndex];
    if (!currentPost) return;

    if (!requireAuth()) return;

    const quoteKey = currentPost.meta?.quoteKey;
    if (!quoteKey) return;

    try {
      const response = currentPost.interactions?.savedByUser
        ? await postService.unsaveQuote(quoteKey)
        : await postService.saveQuote(quoteKey);

      if (response.success && response.data) {
        updatePostInteractions(currentIndex, response.data);
      }
    } catch (error) {
      console.error('Save toggle failed:', error);
    }
  };

  const handleOpenBook = () => {
    const currentPost = posts[currentIndex];
    if (!currentPost) return;

    const bookId = currentPost.meta?.bookId || currentPost.bookId;
    if (!bookId) return;

    navigate(`/books/${bookId}`);
  };

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
               style={{ borderColor: 'var(--color-accent-primary)' }}></div>
          <p className="font-inter text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <p className="font-inter text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            No posts available yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  const currentQuote = {
    id: currentPost.id,
    quote: currentPost.quoteText,
    author: currentPost.bookAuthor || currentPost.userName || 'Anonymous',
    book: currentPost.bookTitle,
    cover: currentPost.coverImage
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Quote Card - Instagram Reels Style */}
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentQuote.cover})`,
                filter: 'blur(20px) brightness(0.4)',
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8">
              {/* Top Section - Progress Indicators */}
              <div className="flex gap-1">
                {posts.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        backgroundColor: idx <= currentIndex ? 'var(--color-accent-primary)' : 'transparent',
                        width: idx === currentIndex ? '100%' : idx < currentIndex ? '100%' : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Middle Section - Quote */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl font-literata italic leading-relaxed mb-8"
                    style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                  >
                    "{currentQuote.quote}"
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p
                      className="text-xl font-dancing mb-2"
                      style={{ color: 'var(--color-accent-warm)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                    >
                      — {currentQuote.author}
                    </p>
                    <p
                      className="font-inter text-sm flex items-center justify-center gap-2"
                      style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                    >
                      {currentPost.bookTitle ? (
                        <>
                          <BookMarked size={14} />
                          {currentQuote.book}
                        </>
                      ) : (
                        <>
                          <UserIcon size={14} />
                          {currentPost.type || currentPost.userName}
                        </>
                      )}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Section - Actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p
                    className="font-inter text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                  >
                    {currentPost.userName}
                  </p>
                  {currentPost.meta?.views ? (
                    <p className="font-inter text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {currentPost.meta.views.toLocaleString()} views
                    </p>
                  ) : null}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: currentPost.bookTitle ? 1.05 : 1 }}
                    whileTap={{ scale: currentPost.bookTitle ? 0.95 : 1 }}
                    className="flex flex-col items-center gap-1"
                    onClick={handleOpenBook}
                    disabled={!currentPost.bookTitle}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: currentPost.bookTitle
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                        opacity: currentPost.bookTitle ? 1 : 0.5
                      }}
                    >
                      <BookOpen size={24} style={{ color: '#ffffff' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#ffffff' }}>
                      Book
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1"
                    onClick={handleLikeToggle}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: currentPost.interactions?.likedByUser
                          ? 'rgba(255, 255, 255, 0.35)'
                          : 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <Heart
                        size={24}
                        style={{ color: '#ffffff' }}
                        fill={currentPost.interactions?.likedByUser ? 'var(--color-accent-primary)' : 'transparent'}
                      />
                    </div>
                    <span className="text-xs" style={{ color: '#ffffff' }}>
                      Like · {currentPost.interactions?.likesCount ?? 0}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1"
                    onClick={handleSaveToggle}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: currentPost.interactions?.savedByUser
                          ? 'rgba(255, 255, 255, 0.35)'
                          : 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <Bookmark
                        size={24}
                        style={{ color: '#ffffff' }}
                        fill={currentPost.interactions?.savedByUser ? 'var(--color-accent-primary)' : 'transparent'}
                      />
                    </div>
                    <span className="text-xs" style={{ color: '#ffffff' }}>
                      Save · {currentPost.interactions?.savesCount ?? 0}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={goToPrevious}
          className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
        >
          <ChevronUp size={28} style={{ color: '#ffffff' }} />
        </motion.button>
      )}

      {currentIndex < posts.length - 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={goToNext}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
        >
          <ChevronDown size={28} style={{ color: '#ffffff' }} />
        </motion.button>
      )}

      {/* Instructions - Only show initially */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40"
        >
          <p
            className="text-sm font-inter text-center px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              color: '#ffffff',
              backdropFilter: 'blur(10px)'
            }}
          >
            Scroll, swipe, or use ↑↓ keys to navigate
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DiscoverQuotes;
