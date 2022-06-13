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
  const departamentos = await request({url: `http://localhost:${config.PORT}/API/departamentos`});
  const sexos = await request({url: `http://localhost:${config.PORT}/API/sexo`});
  const estados = await request({url: `http://localhost:${config.PORT}/API/estado`});
  const GSs = await request({url: `http://localhost:${config.PORT}/API/grupo-sanguineo`});
  const RHs = await request({url: `http://localhost:${config.PORT}/API/RH`});


  res.render('createUserData', {
    departamentos: eval(departamentos),
    sexos: eval(sexos),
    estados: eval(estados),
    GSs: eval(GSs),
    RHs: eval(RHs),
    errors: []
  })

}

module.exports = {
  getindex,
  signIn,
  signOut,
  getCreateUserData
}