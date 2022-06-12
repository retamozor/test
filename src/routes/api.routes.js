const router = require('express').Router();
const api = require('../controllers/api.controller');

router.get('/departamentos', api.getDpto)

router.get('/ciudad-por-dpto', api.getCiudadPorDpto)

router.get('/user-data', api.getUserData)

router.post('/user-data', api.createUserData)

router.put('/user-data', api.updateUserData)

router.post('/signUp', api.createUser)

router.get('/sexo', api.getSexo)

router.get('/estado', api.getEstado)

router.get('/grupo-sanguineo', api.getGS)

router.get('/RH', api.getRH)

module.exports = router