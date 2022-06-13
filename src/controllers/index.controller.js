const {validationResult} = require('express-validator');
const request = require('request-promise');
const config = require('./config')

const getindex = (req, res) => res.render('index', {errors: [], auth: req.auth, user: req.user});

const signIn = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).render(
    'index', 
    {errors: errors.array(), auth: false}
  );

  res.redirect('/');  
}

const signOut = (req, res) => {
  req.session.destroy(null);
  res.redirect('/')
}

const getCreateUserData = async (req, res) => {
  if (!req.auth) {
    return res.status(401).redirect('/')
  }

  let headers = {'Content-Type': 'application/json', cookie: req.headers.cookie}
  
  const departamentos = await request({url: `http://localhost:${config.PORT}/API/departamentos`, headers } );
  const sexos = await request({url: `http://localhost:${config.PORT}/API/sexo`, headers });
  const estados = await request({url: `http://localhost:${config.PORT}/API/estado`, headers });
  const GSs = await request({url: `http://localhost:${config.PORT}/API/grupo-sanguineo`, headers });
  const RHs = await request({url: `http://localhost:${config.PORT}/API/RH`, headers });


  res.render('createUserData', {
    departamentos: eval(departamentos),
    sexos: eval(sexos),
    estados: eval(estados),
    GSs: eval(GSs),
    RHs: eval(RHs),
    errors: []
  })

}

const getUpdateUserData = async (req, res) => {
  if (!req.auth) {
    return res.status(401).redirect('/')
  }

  let headers = {'Content-Type': 'application/json', cookie: req.headers.cookie}

  const estados = await request({url: `http://localhost:${config.PORT}/API/estado`, headers });

  res.render('updateUserData', {
    estados: eval(estados),
    user:config.USER_MODEL
  })
}

const searchUserData = async (req, res) => {
  const cedula = req.body.cedula;
  if (!req.auth) {
    return res.status(401).redirect('/')
  }

  let headers = {'Content-Type': 'application/json', cookie: req.headers.cookie}

  const estados = await request({url: `http://localhost:${config.PORT}/API/estado`, headers });
  const user = await request({url: `http://localhost:${config.PORT}/API/user-data?cedula=${cedula}`, headers });
  if (user == '[]') {

    return res.render('updateUserData', {
      estados: eval(estados),
      user: config.USER_MODEL,
      err: `no existe un usuario con cedula ${cedula}`
    })
  }
  res.render('updateUserData', {
    estados: eval(estados),
    user: eval(user)[0]
  })
}

module.exports = {
  getindex,
  signIn,
  signOut,
  getCreateUserData,
  getUpdateUserData,
  searchUserData
}