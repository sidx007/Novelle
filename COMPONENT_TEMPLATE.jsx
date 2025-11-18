/* 
 * NOVELLE COMPONENT TEMPLATE
 * Use this as a starting point for creating new components
 * that match the Novelle design system
 */

import React from 'react';
import { motion } from 'framer-motion';
import { YourIcon } from 'lucide-react'; // Import icons from lucide-react

const YourComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
      // Use CSS variables for colors - never hardcode!
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-light)',
      }}
    >
      {/* Headings - Use Playfair Display */}
      <h2
        className="text-3xl font-playfair font-semibold mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Your Heading
      </h2>

      {/* Body Text - Use Literata */}
      <p
        className="font-literata text-lg mb-4"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Your content goes here. Use semantic HTML and CSS variables.
      </p>

      {/* UI Elements - Use Inter */}
      <div className="flex gap-4">
        {/* Primary Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center gap-2"
        >
          <YourIcon size={20} />
          Primary Action
        </motion.button>

        {/* Secondary Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center gap-2"
        >
          Secondary Action
        </motion.button>
      </div>

      {/* Card with Hover Effect */}
      <motion.div
        whileHover={{ y: -4 }}
        className="glass rounded-lg p-4 mt-6 card-hover"
        style={{
          borderColor: 'var(--color-border-light)',
        }}
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Cards should use the .card-hover class for consistent animations
        </p>
      </motion.div>
    </motion.div>
  );
};

export default YourComponent;

/* 
 * DESIGN SYSTEM QUICK REFERENCE
 * 
 * FONTS:
 * - font-playfair (headings)
 * - font-literata (body)
 * - font-inter (UI)
 * - font-dancing (script accents)
 * 
 * COLORS (via CSS variables):
 * - var(--color-bg-primary)       - Main background
 * - var(--color-bg-secondary)     - Secondary background
 * - var(--color-bg-card)          - Card backgrounds
 * - var(--color-text-primary)     - Main text
 * - var(--color-text-secondary)   - Secondary text
 * - var(--color-text-accent)      - Accent text
 * - var(--color-text-muted)       - Muted text
 * - var(--color-accent-primary)   - Primary accent
 * - var(--color-accent-secondary) - Secondary accent
 * - var(--color-border-light)     - Light borders
 * - var(--color-border-medium)    - Medium borders
 * 
 * UTILITY CLASSES:
 * - .glass                 - Glassy card effect with backdrop blur
 * - .card-hover            - Hover effect for cards (lift + shadow)
 * - .animated-underline    - Animated underline on hover
 * - .shadow-soft           - Soft shadow (sm)
 * - .shadow-soft-md        - Medium soft shadow
 * - .shadow-soft-lg        - Large soft shadow
 * - .shadow-glow           - Glowing shadow effect
 * - .btn-primary           - Primary button style
 * - .btn-secondary         - Secondary button style
 * - .quote-text            - Styled quote text
 * - .quote-author          - Styled author name (script font)
 * - .reading-content       - Reader content wrapper
 * - .container-custom      - Centered container with padding
 * 
 * SPACING (CSS variables):
 * - var(--spacing-xs)  = 0.25rem
 * - var(--spacing-sm)  = 0.5rem
 * - var(--spacing-md)  = 1rem
 * - var(--spacing-lg)  = 1.5rem
 * - var(--spacing-xl)  = 2rem
 * - var(--spacing-2xl) = 3rem
 * 
 * BORDER RADIUS (CSS variables):
 * - var(--radius-sm)  = 0.375rem
 * - var(--radius-md)  = 0.5rem
 * - var(--radius-lg)  = 0.75rem
 * - var(--radius-xl)  = 1rem
 * 
 * TRANSITIONS:
 * - var(--transition-fast) = 150ms ease
 * - var(--transition-base) = 250ms ease
 * - var(--transition-slow) = 350ms ease
 * 
 * FRAMER MOTION PATTERNS:
 * 
 * 1. Fade in on mount:
 *    initial={{ opacity: 0, y: 20 }}
 *    animate={{ opacity: 1, y: 0 }}
 *    transition={{ duration: 0.5 }}
 * 
 * 2. Hover lift:
 *    whileHover={{ y: -4, scale: 1.02 }}
 * 
 * 3. Button press:
 *    whileTap={{ scale: 0.95 }}
 * 
 * 4. Stagger children:
 *    transition={{ staggerChildren: 0.1 }}
 * 
 * 5. Scroll reveal:
 *    initial={{ opacity: 0, y: 20 }}
 *    whileInView={{ opacity: 1, y: 0 }}
 *    viewport={{ once: true }}
 * 
 * ICONS:
 * - Import from 'lucide-react'
 * - Use size={20} for buttons
 * - Use size={24} for larger icons
 * - Color with inline styles: style={{ color: 'var(--color-accent-primary)' }}
 * 
 * BEST PRACTICES:
 * 1. Never hardcode colors - always use CSS variables
 * 2. Use semantic HTML (header, nav, main, section, article)
 * 3. Add hover states with Framer Motion
 * 4. Keep components small and focused
 * 5. Use .glass class for card backgrounds
 * 6. Maintain consistent spacing with Tailwind utilities
 * 7. Test all three themes (light, sepia, night)
 */
