const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const express = require('express');
const googleAuth = require('../middlewares/google.auth');
const googleRouter   = express.Router();
require('dotenv').config();

let userProfile;
passport.use(
  new GoogleStrategy(
    {
      clientID: '434501865342-0ieb979n5h2gcmti2m1q5tkpefido2vt.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:6420/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

// request at /auth/google, when user click sign-up with google button transferring
// the request to google server, to show emails screen
googleRouter.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// URL Must be same as 'Authorized redirect URIs' field of OAuth client, i.e: /auth/google/callback
googleRouter.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/error' }),
  (req, res) => {
    res.redirect('/auth/google/success'); // Successful authentication, redirect success.
  }
);

googleRouter.get('/success', async (req, res) => {
  const { failure, success } = await googleAuth.registerWithGoogle(userProfile);
  if (failure) console.log('Google user already exist in DB..');
  else console.log('Registering new Google user..');
  res.render('success', { user: userProfile });
});

googleRouter.get('/error', (req, res) => res.send('Error logging in via Google..'));

googleRouter.get('/signout', (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.render('auth');
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out user' });
  }
});

module.exports = googleRouter;