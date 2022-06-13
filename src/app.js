const express = require('express');
const path = require('path');
const session = require('express-session');
const pgPool = require('./controllers/postgreSQL');
const pgSession = require('connect-pg-simple')(session);
const config = require('./controllers/config');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', config.PORT);

app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

//session
app.use(session({
  secret: config.SESSION_KY,
  name:'sessionID', resave: true,
  saveUninitialized: true,
  rolling:true,
  store: new pgSession({
    pool: pgPool,
    tableName: 'user_session',
    createTableIfMissing: true
  }),
  cookie: {
    maxAge: 10*60*1000
  }
}))

app.use('/', require('./routes/index.routes'));
app.use('/API', require('./routes/api.routes'));

app.use((req, res)=>{
  res.status(404).redirect('/')
})

module.exports = app;

