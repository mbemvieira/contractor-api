const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const { getBestProfession, getBestClients } = require('../controllers/admin');

const router = express.Router();

router.get('/best-profession', [getProfile], getBestProfession);
router.get('/best-clients', [getProfile], getBestClients);

module.exports = router;
