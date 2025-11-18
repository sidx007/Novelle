import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Quote, Loader2, Bookmark } from 'lucide-react';
import profileService from '../services/profileService';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await profileService.getCurrentProfile();
        if (isMounted) {
          if (response?.success) {
            setProfileData(response.data);
          } else {
            setError('Unable to load profile');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Unable to load profile');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--color-accent-primary)' }} />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p className="font-literata text-xl" style={{ color: 'var(--color-text-secondary)' }}>{error || 'Unable to load profile'}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Return Home
        </motion.button>
      </div>
    );
  }

  const { user, profile, posts = [], quotes = [] } = profileData;

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-10">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-6 shadow-soft"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
                style={{
                  backgroundImage: `url(${profile?.profilePicture || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=400&fit=crop'})`
                }}
              />
              <h1 className="text-2xl font-playfair font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {profile?.displayName || user?.name || user?.username}
              </h1>
              <p className="font-inter text-sm" style={{ color: 'var(--color-text-muted)' }}>
                @{user?.username}
              </p>
              {profile?.bio ? (
                <p className="font-literata text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {profile.bio}
                </p>
              ) : null}

              <div className="w-full grid grid-cols-3 gap-4 mt-6">
                <div className="glass rounded-xl p-3">
                  <p className="font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>Posts</p>
                  <p className="text-xl font-playfair" style={{ color: 'var(--color-text-primary)' }}>{posts.length}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>Quotes</p>
                  <p className="text-xl font-playfair" style={{ color: 'var(--color-text-primary)' }}>{quotes.length}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>Goal</p>
                  <p className="text-xl font-playfair" style={{ color: 'var(--color-text-primary)' }}>{profile?.readingGoal ?? 0}</p>
                </div>
              </div>

              {profile?.favoriteGenres?.length ? (
                <div className="mt-6 w-full">
                  <h3 className="font-inter text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Favorite Genres
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile.favoriteGenres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 rounded-full text-xs font-inter"
                        style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.aside>

          <div className="space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={24} style={{ color: 'var(--color-accent-primary)' }} />
                <h2 className="text-3xl font-playfair font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Recent Posts
                </h2>
              </div>
              {posts.length === 0 ? (
                <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>
                  You have not posted anything yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.postId || index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass rounded-2xl p-5 flex gap-4"
                    >
                      {post.book?.coverImage ? (
                        <div className="w-20 h-28 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${post.book.coverImage})` }} />
                      ) : null}
                      <div className="flex-1">
                        <p className="font-literata text-lg" style={{ color: 'var(--color-text-primary)' }}>
                          {post.title}
                        </p>
                        <div className="flex items-center justify-between mt-2 font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          <span>{post.book?.title || 'Original quote'}</span>
                          <span>{post.views?.toLocaleString()} views</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <Quote size={24} style={{ color: 'var(--color-accent-primary)' }} />
                <h2 className="text-3xl font-playfair font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Saved Quotes
                </h2>
              </div>
              {quotes.length === 0 ? (
                <p className="font-inter" style={{ color: 'var(--color-text-muted)' }}>
                  No quotes saved yet. Discover more to add your favorites!
                </p>
              ) : (
                <div className="grid gap-4">
                  {quotes.map((quote, index) => (
                    <motion.blockquote
                      key={quote.quoteId || index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass rounded-2xl p-5"
                    >
                      <p className="font-literata italic mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        “{quote.content}”
                      </p>
                      <footer className="flex justify-between items-center font-inter text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <span>{quote.book?.title || profile?.displayName || user?.name}</span>
                        {quote.pageNumber ? <span>Page {quote.pageNumber}</span> : null}
                      </footer>
                    </motion.blockquote>
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <Bookmark size={24} style={{ color: 'var(--color-accent-primary)' }} />
                <h2 className="text-3xl font-playfair font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Reading Progress
                </h2>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="font-inter" style={{ color: 'var(--color-text-secondary)' }}>
                  Track your current reads and favorite passages from this dashboard.
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
