const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const {
  get,
  getById,
} = require('../controllers/contracts');

const router = express.Router();

router.get('/', [getProfile], get);
router.get('/:id', [getProfile], getById);

module.exports = router;
