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

const validate_estado = body('estado').custom(async (estado, {req}) => {
  const prevEstado = await pool.query(`
    SELECT u.estado
    FROM userdata u
    WHERE cedula = '${req.body.cedula}'
  `)
  switch (prevEstado.rows[0].estado) {
    case 1:
      if (estado > 2) throw new Error('soltero/a solo se puede actualizar a casado/a')
      break;
    case 2:
      if (estado == 1) throw new Error('casado/a no puede actualizar a soltero/a')
      break;
    case 3:
      if (estado != 2) throw new Error('viudo/a solo se puede actualizar a casado/a')
      break;
    case 4:
      if (estado != 2) throw new Error('divorciado/a solo se puede actualizar a casado/a')
      break;

  
    default:
      break;
  }
})

module.exports = {
  validate_user,
  validate_token,
  validate_estado
}