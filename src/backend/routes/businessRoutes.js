
const express = require('express');
const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} = require('../controllers/businessController');
const { protect, business } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createBusiness)
  .get(getBusinesses);

router.route('/:id')
  .get(getBusinessById)
  .put(protect, updateBusiness)
  .delete(protect, deleteBusiness);

module.exports = router;
