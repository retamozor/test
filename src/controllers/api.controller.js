const { body } = require('express-validator');
const pool = require('./postgreSQL');

const getDpto = async (req, res) => {
  const response = await pool.query(`
    SELECT DISTINCT departamento
    FROM ciudad
    ORDER BY departamento ASC
  `)
  
  res.json(response.rows)
};

const getCiudadPorDpto = async (req, res) => {
  const {departamento} = req.body
  const response = await pool.query(`
    SELECT *
    FROM ciudad
    WHERE departamento = '${departamento}'
  `)

  res.json(response.rows)
}

const getUserData = async (req, res) => {

  const user = req.body
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
        '${user.gs}',
        '${user.rh}',
        '${user.sexo}',
        '${user.fecha_exp}',
        '${user.lugar_exp}',
        '${user.estado}'
      )
    `)
    res.status(200)
  } catch (error) {
    res.status(400).json(error)
  }
  
}

const updateUserData = async (req, res) => {
  const user = req.body;
  try {
    const response = await pool.query(`
      UPDATE userdata
      SET estado = '${user.estado}'
    `)
    res.status(200).json(response)
  } catch (error) {
    
  }
}

const createUser = async (req, res) => {
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
  const sexos  = await pool.query('SELECT * FROM sexo')
  res.json(sexos.rows)
}
const getEstado = async (req,res) => {
  const estados  = await pool.query('SELECT * FROM estado')
  res.json(estados.rows)
}
const getGS = async (req,res) => {
  const gs  = await pool.query('SELECT * FROM grupo_sanguineo')
  res.json(gs.rows)
}
const getRH = async (req,res) => {
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