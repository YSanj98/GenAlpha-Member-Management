const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
require("dotenv").config();



passport.use(
	new GoogleStrategy(
	  {
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: "/auth/google/callback",
		passReqToCallback: true
	  },
	  (request, accessToken, refreshToken, profile, done) => {
		// Here, 'request' is the optional request object, you can use it if needed
		console.log(profile);
		return done(null, profile);
	  }
	)
  );
  



passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = passport;