const router = require('express').Router();
const api = require('../controllers/api.controller');
const val = require('../controllers/validator');

router.get('/departamentos', val.validate_token, api.getDpto)

router.get('/ciudad-por-dpto', val.validate_token, api.getCiudadPorDpto)

router.get('/user-data', val.validate_token, api.getUserData)

router.post('/user-data', val.validate_token, api.createUserData)

router.put('/user-data', val.validate_token, val.validate_estado, api.updateUserData)

router.post('/signUp', val.validate_token, api.createUser)

router.get('/sexo', val.validate_token, api.getSexo)

router.get('/estado', val.validate_token, api.getEstado)

router.get('/grupo-sanguineo', val.validate_token, api.getGS)

router.get('/RH', val.validate_token, api.getRH)

module.exports = router