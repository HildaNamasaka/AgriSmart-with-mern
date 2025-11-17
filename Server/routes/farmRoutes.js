import express from 'express';
import {
  getFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm
} from '../controllers/farmController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFarms)
  .post(createFarm);

router.route('/:id')
  .get(getFarm)
  .put(updateFarm)
  .delete(deleteFarm);

export default router;