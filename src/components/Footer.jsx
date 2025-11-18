import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="mt-20 py-12"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border-light)',
      }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3
              className="text-xl font-playfair font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              About Novelle
            </h3>
            <p
              className="font-literata text-sm leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              A cozy corner of the internet for book lovers. Discover beautiful
              quotes, build your reading library, and immerse yourself in the
              world of literature.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-xl font-playfair font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Explore
            </h3>
            <ul className="space-y-2 font-inter text-sm">
              <li>
                <a
                  href="#"
                  className="animated-underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Popular Quotes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="animated-underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  New Releases
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="animated-underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Collections
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3
              className="text-xl font-playfair font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Connect
            </h3>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="p-2 rounded-full"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="p-2 rounded-full"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="p-2 rounded-full"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-12 pt-8 text-center font-inter text-sm"
          style={{
            borderTop: '1px solid var(--color-border-light)',
            color: 'var(--color-text-muted)',
          }}
        >
          <p className="flex items-center justify-center gap-2">
            Made with <Heart size={16} fill="var(--color-accent-primary)" /> for
            book lovers everywhere
          </p>
          <p className="mt-2">© 2025 Novelle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
