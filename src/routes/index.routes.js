const router = require('express').Router();
const index = require('../controllers/index.controller');
const val = require('../controllers/validator');

router.get('/', val.validate_token, index.getindex)
router.post('/', val.validate_user, index.signIn)
module.exports = router