const router = require('express').Router();
const index = require('../controllers/index.controller');

router.get('/', index.getindex)

module.exports = router