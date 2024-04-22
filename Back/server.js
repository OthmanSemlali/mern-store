if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const initializePassport = require("./config/passport-config");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");

const flash = require("express-flash");
const {body, validationResult} = require("express-validator");

const User = require('./Models/user.model');
const { connectDB } = require('./database/connect');
const { requireRole, checkAuthenticated, checkNotAuthenticated } = require('./middlewares/auth.mw');

const categoryRouter = require('./Routes/category.routes')
const productRouter = require('./Routes/product.routes')
const userRouter = require('./Routes/user.routes')
const orderRouter = require('./Routes/order.routes')
const cors = require('cors')
connectDB();

app.use(cors())
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

// ** Routes Call **
app.use('/api/categories', categoryRouter );
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);


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

      const {email, password} = req.body;
      // const user = ;
      if(await User.getUserByEmail(email)){
      
          return res.status(400).json({ errors: [{"type":"field","value":email, "msg":"Email Already Exist","path":"email"}] });
      }
   
        const hashedPassword = await bcrypt.hash(password, 10);
       
        const newUser = await User.addUser({
            email: req.body.email,
            password: hashedPassword,
            role:req.body.role
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

app.get('/auth/google/callback', checkNotAuthenticated,
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


//? This route for test middlewares/auth etc..
app.get('/auth/protected',checkAuthenticated, (req, res) => {
    let email = req.user.email;
    console.log('req.user.id', req.user.id)
    res.send(`Hello ${email}`);
})


// error Middlewares
app.use((req, res) => {
  res.status(404).send("Route Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port 3000: http://localhost:${PORT}/`);
});
