const express = require('express');
const router = express.Router();

const storeItem = require('../storeItem/storeItem.router');

router.use('/items', storeItem);

module.exports = router;
