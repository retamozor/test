const router = require('express').Router();
const index = require('../controllers/index.controller');
const val = require('../controllers/validator');

router.get('/', val.validate_token, index.getindex);

router.post('/', val.validate_user, index.signIn);

router.get('/signOut', index.signOut);

router.get('/create-user-data', val.validate_token, index.getCreateUserData)

module.exports = router