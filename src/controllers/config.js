require('dotenv').config()

module.exports = {
  database: {
    host: process.env.HOST_DB || "localhost",
    user: process.env.USER_DB || "postgres",
    database: process.env.DATABASE || "cedula",
    password: process.env.PASS_DB || "password",
    port: process.env.PORT_DB || 5432
  },
  PORT: process.env.PORT || 8080,
  SESSION_KY: process.env.SESSION_KY,
  SECRET: process.env.SECRET,
  USER_MODEL:{
    cedula: '',
    nombres: '',
    apellidos: '',
    estado: '',
    estatura: '',
    fecha_exp: '',
    fecha_nacimiento: '',
    gs: '',
    rh: '',
    sexo: '',
    ciudad_nto: '',
    dpto_nto: '',
    ciudad_exp: '',
    dpto_exp: ''
  }
}