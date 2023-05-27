const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const { isClientProfile } = require('../middlewares/isClientProfile');
const {
  getUnpaid,
  pay,
} = require('../controllers/jobs');

const router = express.Router();

router.get('/unpaid', [getProfile], getUnpaid);
router.post('/:id/pay', [getProfile, isClientProfile], pay);

module.exports = router;
