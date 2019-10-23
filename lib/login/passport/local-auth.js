const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../../../config/config');
const mongoPool = require('../../connectors/mongodb-pool');

const mongoUri = mongoPool.getUri(config.nosql.users.uri);


const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const comparePassword = (password, userPassWord) => bcrypt.compareSync(password, userPassWord);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const mongo = mongoPool.get(mongoUri);
  mongo.findById('users', id, (err, user) => {
    done(null, user);
  });
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const mongo = mongoPool.get(mongoUri);
  mongo.findOne('users', { email: email }, (err, user) => {
    if (user) {
      return done(null, false, req.flash('signupMessage', 'The Email already exists.'));
    }
    const newUser = {
      email: email,
      password: encryptPassword(password)
    };

    mongo.insert('users', newUser, (_err, result) => {
      // eslint-disable-next-line no-underscore-dangle
      newUser.id = newUser._id.toString();
      done(null, newUser);
    });
  });
}));


passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const mongo = mongoPool.get(mongoUri);
  mongo.findOne('users', { email: email }, (err, user) => {
    if (!user) {
      return done(null, false, req.flash('signinMessage', 'No user found.'));
    }
    if (!comparePassword(password, user.password)) {
      return done(null, false, req.flash('signinMessage', 'Incorrect password'));
    }
    // eslint-disable-next-line no-underscore-dangle
    user.id = user._id.toString();
    done(null, user);
  });
}));
