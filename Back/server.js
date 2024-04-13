if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const fs = require('fs').promises;
// const users = require('./users.json')
const initializePassport = require("./config/passport-config");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");

const flash = require("express-flash");
const {body, validationResult} = require("express-validator");
// const { default: User } = require('./Model/User');

// const User = require('./Model/User');
const { default: mongoose } = require('mongoose');
const User = require('./Models/user.model');
const { connectDB } = require('./database/connect');
// const { default: connectDB } = require('./database/connect');

connectDB();

initializePassport(
    passport,
    User.getUserByEmail,
    User.getUserByGoogleId,
    User.addUser,
    User.fetchUserById
);

app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie:{secure:false}
}));

// this is to initialize the passport
app.use(passport.initialize());

// this is to keep the user logged in / to set the token or info from tha passport js to our session!
app.use(passport.session());

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const validateInputs = [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long").escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            
            
            return res.json({errors: errors.array()})
        }
        next();
    }
];

// Routes






// end Routes


const sanitizeLoginInput = [
    body("username").trim().escape()
];

app.post("/api/login", sanitizeLoginInput, checkNotAuthenticated, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred during authentication' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'An error occurred during login' });
        }
        return res.status(200).json({ message: 'Login successful', user: user });
      });
    })(req, res, next);
  });
  
app.post("/api/register",validateInputs,checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // users.push({
        // id: Date.now().toString(),
        // email: req.body.email,
        // password: hashedPassword,
        // });

        // await fs.writeFile('./users.json', JSON.stringify(users, null, 2));

        await User.addUser({
            // id: Date.now().toString(),
            email: req.body.email,
            password: hashedPassword,
            })
        return res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch {
        return res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// server logout!!!
app.get("/api/logout", (req, res) => {

    // req.session.destroy()
    req.logOut((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        return res.json({message: "Logged OUT"})
    });
});

//google auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: false,
    failureRedirect: false
  }),
  (req, res) => {
    if (req.user) {
   
     // created property, indicating a new registration (authenticate in passport-config.js)
     const registrationSuccess = req.user.created === true;

     if (registrationSuccess) {
       res.status(201).json({ message: 'Google registration success', user: req.user });
     } else {
       res.status(200).json({ message: 'Google login success', user: req.user });
     }
     
    } else {
      res.status(401).json({ error: 'Google authentication failed' });
    }
  }
);

//failure pages
// app.get('/auth/google/failure', (req, res) => {
//     res.send('Something Went Wrong');
// })
// app.get('/auth/local/failure', (req, res) => {
//     res.send('Something Went Wrong');
// })


// app.get('/auth/protected',checkAuthenticated, (req, res) => {
//     let name = req.user.email;
//     res.send(`Hello ${name}`);
// })

app.use((req, res) => {
  res.status(404).send("Route Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});


// function isLoggedIn(req, res, next) {
//     req.user ? next() : res.sendStatus(401);
// }

// function checkAuthenticated(req, res, next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     // res.redirect("/login");
//     res.sendStatus(401)
// }

//restrict user from send request for loging while he already logged!
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        // return res.redirect("/dashboard");

        return res.json({error: "Unautorized (you must be logged out to perform such an operation)"})
    }
    next();
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
