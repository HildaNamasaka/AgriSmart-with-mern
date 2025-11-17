import express from 'express';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, createListing);

router.get('/my/listings', protect, getMyListings);

router.route('/:id')
  .get(getListing)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

export default router;