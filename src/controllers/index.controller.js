const {validationResult} = require('express-validator');

const getindex = (req, res) => res.render('index', {errors: [], auth: req.auth, user: req.user});

const signIn = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).render(
    'index', 
    {errors: errors.array(), auth: false}
  );

  res.redirect('/');  
}

module.exports = {
  getindex,
  signIn
}