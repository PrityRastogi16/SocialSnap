const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const express = require('express');
const User = require('../../models/user.model');

const router = express.Router();
require('dotenv').config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'picture.type(large)'],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(accessToken)
      console.log(refreshToken)
      const user = await User.findOne({
        accountId: profile.id,
        provider: 'facebook',
      });
      if (!user) {
        console.log('Adding new facebook user to DB..');
        let defaultimage = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"; 
        const user = new User({
          accountId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null,
          
          photoURL: profile.photos ? profile.photos[0].value : defaultimage,
          provider: profile.provider,
        });console.log(user.name)
        await user.save();
        console.log(user);
        return cb(null, profile);
      } else {
        console.log('Facebook User already exist in DB..');
        console.log(profile.emails[0].value);
        console.log(profile.photos[0].value)
        return cb(null, profile);
      }
    }
  )
);

router.get('/', passport.authenticate('facebook', { scope: 'email' }));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error',
  }),
  function (req, res) {
    // Successful authentication, redirect to success screen.
    res.redirect('/auth/facebook/success');
  }
);

router.get('/success', async (req, res) => {
  // console.log(data)
  const userInfo = {
    
    id: req.session.passport.user.id,
    displayName: req.session.passport.user.displayName,
    provider: req.session.passport.user.provider,
    // Email: req.session.passport.user.email,
    // console.log(userInfo.Email)
  };
  
  res.render('fb-github-success', { user: userInfo });
});

router.get('/error', (req, res) => res.send('Error logging in via Facebook..'));

router.get('/signout', (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.render('auth');
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out fb user' });
  }
});

module.exports = router;