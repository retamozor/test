const {validationResult} = require('express-validator');
const pool = require('./postgreSQL');

const getDpto = async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const response = await pool.query(`
    SELECT DISTINCT departamento
    FROM ciudad
    ORDER BY departamento ASC
  `)
  
  res.json(response.rows)
};

const getCiudadPorDpto = async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const {departamento} = req.query
  const response = await pool.query(`
    SELECT *
    FROM ciudad
    WHERE departamento = '${departamento}'
  `)

  res.json(response.rows)
}

const getUserData = async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }

  const user = req.query
  let filter = ''
  if (user.cedula) filter = `WHERE u.cedula = ${user.cedula}`

  if (user.nombres) {
    if (filter == '') filter = `WHERE u.nombres LIKE UPPER('%${user.nombres}%')`
    else filter += `AND u.nombres LIKE UPPER('%${user.nombres}%')`
  }

  if (user.apellidos) {
    if (filter == '') filter = `WHERE u.apellidos LIKE UPPER('%${user.apellidos}%')`
    else filter += `AND u.apellidos LIKE UPPER('%${user.apellidos}%')`
  }
  const response = await pool.query(`
    SELECT 
      u.cedula,
      u.nombres,
      u.apellidos,
      e.estado,
      u.estatura,
      u.fecha_exp,
      u.fecha_nacimiento,
      gs.gs,
      rh.rh,
      s.sexo,
      c_nto.nombre as ciudad_nto,
      c_nto.departamento as dpto_nto,
      c_exp.nombre as ciudad_exp,
      c_exp.departamento as dpto_exp
    FROM 
      userdata u
    JOIN ciudad c_nto ON u.lugar_nacimiento = c_nto.id
    JOIN ciudad c_exp ON u.lugar_exp = c_exp.id
    JOIN estado e ON u.estado = e.id
    JOIN sexo s ON u.sexo = s.id
    JOIN rh ON u.rh = rh.id
    JOIN grupo_sanguineo gs ON u.gs = gs.id
    ${filter}
  `)
  res.status(200).json(response.rows)
}

const createUserData = async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const user = req.body;
  try {
    await pool.query(`
      INSERT INTO
        userdata (
          cedula,
          nombres,
          apellidos,
          fecha_nacimiento,
          lugar_nacimiento,
          estatura,
          gs,
          rh,
          sexo,
          fecha_exp,
          lugar_exp,
          estado)
      VALUES (
        '${user.cedula}',
        UPPER('${user.nombres}'),
        UPPER('${user.apellidos}'),
        '${user.fecha_nacimiento}',
        '${user.lugar_nacimiento}',
        '${user.estatura}',
        '${user.GS}',
        '${user.RH}',
        '${user.sexo}',
        '${user.fecha_expedicion}',
        '${user.lugar_expedicion}',
        '${user.estado}'
      )
    `)
    res.status(200).json({ok:true})
  } catch (error) {
    res.status(400).json({ok:false, error})
  }
  
}

const updateUserData = async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const user = req.body;
  if(user.cedula==undefined || user.estado == undefined) 
  return res.status(400).json({ok:false, error: { code:0, detail:'falta el valor de la cedula o el estado'}});
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json( 
    {ok:false, error: { code:0, detail: errors.array()[0].msg}}
  );
  try {
    await pool.query(`
      UPDATE userdata
      SET estado = '${user.estado}'
      WHERE cedula = '${user.cedula}'
    `)
    res.status(200).json({ok:true})
  } catch (error) {
    
  }
}

const createUser = async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const user = req.body;
  try {
    await pool.query(`
    INSERT INTO
      usuario (
        usuario,
        pass
      )
    VALUES (
      '${user.usuario}',
      crypt('${user.password}', gen_salt('bf'))
    )
  `)
  } catch (error) {
    return res.json(error)
  }
  res.redirect('/')
}

const getSexo = async (req,res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const sexos  = await pool.query('SELECT * FROM sexo')
  res.json(sexos.rows)
}
const getEstado = async (req,res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const estados  = await pool.query('SELECT * FROM estado')
  res.json(estados.rows)
}
const getGS = async (req,res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const gs  = await pool.query('SELECT * FROM grupo_sanguineo')
  res.json(gs.rows)
}
const getRH = async (req,res) => {
  if (!req.auth) {
    return res.status(401).json({ok:false, error: {code:-1, detail:'Sin autorizacion'}})
  }
  const rh  = await pool.query('SELECT * FROM rh')
  res.json(rh.rows)
}


module.exports = {
  getDpto,
  getCiudadPorDpto,
  getUserData,
  createUserData,
  updateUserData,
  createUser,
  getSexo,
  getEstado,
  getGS,
  getRH
}