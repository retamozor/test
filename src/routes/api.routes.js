const router = require('express').Router();
const api = require('../controllers/api.controller');

router.get('/departamentos', api.getDpto)

router.get('/ciudad-por-dpto', api.getCiudadPorDpto)

router.get('/user-data', api.getUserData)

router.post('/user-data', api.createUserData)

router.put('/user-data', api.updateUserData)

module.exports = router