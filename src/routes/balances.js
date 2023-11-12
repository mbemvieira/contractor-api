const express = require('express');
const { addFunds } = require('../controllers/balances');

const router = express.Router();

router.post('/deposit/:userId', addFunds);

module.exports = router;
