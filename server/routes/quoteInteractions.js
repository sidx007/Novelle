import express from 'express';
import QuoteLike from '../models/QuoteLike.js';
import QuoteSave from '../models/QuoteSave.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const normalizeQuoteId = (value) => value?.toString() || '';

const getQuoteStats = async (quoteId, userId) => {
  const [likesCount, savesCount, userLike, userSave] = await Promise.all([
    QuoteLike.countDocuments({ quoteId }),
    QuoteSave.countDocuments({ quoteId }),
    userId ? QuoteLike.exists({ quoteId, userId }) : null,
    userId ? QuoteSave.exists({ quoteId, userId }) : null
  ]);

  return {
    likesCount,
    savesCount,
    likedByUser: Boolean(userLike),
    savedByUser: Boolean(userSave)
  };
};

router.get('/quotes/:quoteId', optionalAuth, async (req, res) => {
  try {
    const quoteId = normalizeQuoteId(req.params.quoteId);
    const stats = await getQuoteStats(quoteId, req.user?._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/quotes/:quoteId/like', protect, async (req, res) => {
  try {
    const quoteId = normalizeQuoteId(req.params.quoteId);
    await QuoteLike.findOneAndUpdate(
      { quoteId, userId: req.user._id },
      { quoteId, userId: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = await getQuoteStats(quoteId, req.user._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    if (error.code === 11000) {
      const quoteId = normalizeQuoteId(req.params.quoteId);
      const stats = await getQuoteStats(quoteId, req.user._id);
      return res.json({ success: true, data: stats });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/quotes/:quoteId/like', protect, async (req, res) => {
  try {
    const quoteId = normalizeQuoteId(req.params.quoteId);
    await QuoteLike.deleteOne({ quoteId, userId: req.user._id });
    const stats = await getQuoteStats(quoteId, req.user._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/quotes/:quoteId/save', protect, async (req, res) => {
  try {
    const quoteId = normalizeQuoteId(req.params.quoteId);
    await QuoteSave.findOneAndUpdate(
      { quoteId, userId: req.user._id },
      { quoteId, userId: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = await getQuoteStats(quoteId, req.user._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    if (error.code === 11000) {
      const quoteId = normalizeQuoteId(req.params.quoteId);
      const stats = await getQuoteStats(quoteId, req.user._id);
      return res.json({ success: true, data: stats });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/quotes/:quoteId/save', protect, async (req, res) => {
  try {
    const quoteId = normalizeQuoteId(req.params.quoteId);
    await QuoteSave.deleteOne({ quoteId, userId: req.user._id });
    const stats = await getQuoteStats(quoteId, req.user._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
