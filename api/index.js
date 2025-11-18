import app from '../server/server.js';

// Vercel serverless function handler
export default async (req, res) => {
  return app(req, res);
};
