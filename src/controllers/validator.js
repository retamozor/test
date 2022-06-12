const {body} = require('express-validator');
const pool = require('./postgreSQL');
const jwt = require('jsonwebtoken');
const config = require('./config');

const validate_user = body('usuario').custom(async (usuario, {req}) => {
  const user = await pool.query(`
    SELECT
      u.usuario,
      u.pass
    FROM
      usuario u
    WHERE
      u.usuario = '${usuario}'
      AND u.pass = crypt('${req.body.password}', u.pass)
  `)
  if (user.rowCount == 0) throw new Error('Usuario y/ó contraseña incorectos')
  const token = jwt.sign(user.rows[0], config.SECRET)
  req.session.token = token;
})

const validate_token = async (req, res, next) => {
  if (!req.session.token) {
    req.auth=false;
    return next()
  }
  const token = req.session.token;
  const decoded = jwt.verify(token, config.SECRET);
  const user = await pool.query(`
    SELECT u.pass
    FROM usuario u
    WHERE usuario = '${decoded.usuario}'
  `)
  const password = user.rows[0].pass

  if (password != decoded.pass) {
    req.auth = false;
    return next();
  }

  req.auth = true;
  req.user = decoded.usuario;
  return next()
}

module.exports = {
  validate_user,
  validate_token
}