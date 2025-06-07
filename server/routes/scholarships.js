import express from 'express';
import { getAll, scrapeData, getItem, clear } from '../controllers/scholarships.js';

const router = express.Router();

// http://localhost:5001/scholarships/
router.get('/', getAll);

// http://localhost:5001/scholarships/scrape
router.post('/scrape', scrapeData);

// http://localhost:5001/scholarships/clear
router.get('/clear', clear);

// http://localhost:5001/scholarships/[searchTerm]
router.get('/:searchTerm', getItem);

export default router;
