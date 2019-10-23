const express = require('express');
const passport = require('passport');
const logger = require('../logger/logger').logger(__filename);

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

router.get('/', (req, res) => {
  res.render('index.ejs');
});

router.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

router.post('/signup', (req, res, next) => {
  logger.debug('signup requested');
  next();
}, passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  passReqToCallback: true
}));


router.get('/signin', async (req, res) => {
  res.render('signin.ejs');
});

router.post('/signin', (req, res, next) => {
  logger.debug('signin requested');
  next();
}, passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  passReqToCallback: true
}));

router.get('/logout', (req, res) => {
  logger.debug('logout requested');
  req.logout();
  res.redirect('/');
});


router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile.ejs');
});

module.exports = router;
