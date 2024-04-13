
const bcrypt = require("bcrypt");
const User = require("../Models/user.model");
const LocalStrategy = require("passport-local").Strategy;

var GoogleStrategy = require("passport-google-oauth2").Strategy;



async function initialize(
  passport
  // getUserByEmail,
  // getUserByGoogleId,
  // addUser,
  // fetchUserById
) {
  // This method is used to authenticate the user. The result of the authenticateUser method is attached to the request object as req.user.
  const authenticateUser = async (email, password, done) => {
    // This method is used to retrieve the user from the database. The result of the getUserByUsername method is attached to the request object as req.user.
    const user = await User.getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "No user with that username" });
    }

    // console.log("user", user);

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  // This method is used to tell passport how to authenticate a user. The result of the authenticateUser method is attached to the request object as req.user.
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
        scope: ["email", "profile"],
      },
      async function (request, accessToken, refreshToken, profile, done) {
        const existingGoogleUser = await User.getUserByGoogleId(profile.id);

        if (existingGoogleUser) {
          console.log("existing google user", existingGoogleUser);

          // Google user already exists locally
          return done(null, existingGoogleUser);
        } else {
          // const role = request.state ? request.state.role : "no_role";


          const role = request.query.role || "no_role";

          // Google user doesn't exist locally -> add the user localy
          const newGoogleUser = {
            id: profile.id,
            googleId: profile.id,
            email: profile.email,
            displayName: profile.displayName,
            role: role,
          };

          try {
            await User.addUser(newGoogleUser);

            newGoogleUser.created = true;
            //user object that will be set on req.user after authentication. It's the user object you want to make available in your route handlers.
            return done(null, newGoogleUser);
          } catch (error) {
            console.error("addUser err ", error);

            return done(null, error.message);
          }
        }
      }
    )
  );

  // This method is used to decide what data from the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}
  passport.serializeUser((user, done) => done(null, user.id));

  // This method is used to retrieve the whole object via the id. That object is attached to the request object as req.user.
  passport.deserializeUser(async (id, done) => {
    if (id.includes("google")) {
      // Google user ID format, fetch user by googleId
      //! const googleId = id.split('-')[1]; // Assuming the format is 'google-{googleId}'

      const googleUser = await User.getUserByGoogleId(id);
      if (googleUser) {
        console.log("google user ", googleUser);
        done(null, googleUser);
      } else {
        done(new Error("Google user not found"));
      }
    } else {
      // Local user ID format, fetch user by id
      const localUser = await User.fetchUserById(id);

      if (localUser) {
        // console.log("ll ", localUser);
        done(null, localUser);
      } else {
        done(new Error("User not found"));
      }
    }
  });
}

module.exports = initialize;
