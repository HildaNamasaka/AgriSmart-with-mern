import express from 'express';
import {
  getPrices,
  getPricesByCrop,
  createPrice,
  updatePrice,
  deletePrice
} from '../controllers/priceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPrices)
  .post(protect, createPrice);

router.get('/:crop/:county', getPricesByCrop);

router.route('/:id')
  .put(protect, updatePrice)
  .delete(protect, deletePrice);

export default router;