if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const initializePassport = require("./config/passport-config");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");

const flash = require("express-flash");
const { body, validationResult } = require("express-validator");

const User = require('./Models/user.model');
const { connectDB } = require('./database/connect');
const { requireRole, checkAuthenticated, checkNotAuthenticated } = require('./middlewares/auth.mw');

const categoryRouter = require('./Routes/category.routes')
const productRouter = require('./Routes/product.routes')
const userRouter = require('./Routes/user.routes')
const orderRouter = require('./Routes/order.routes')
const cors = require('cors');
const { addOrder, placeOrder } = require('./Controllers/order.controller');
const productController = require('./Controllers/product.controller');
connectDB();

const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));
initializePassport(
  passport,
  User.getUserByEmail,
  User.getUserByGoogleId,
  User.addUser,
  User.fetchUserById
);

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
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
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() })
    }
    next();
  }
];

app.get('/fetchProductsByName/:name', productController.fetchProductsByName)

// ** Routes Call **
app.use('/api/categories', categoryRouter);
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
      return res.status(200).json({ error: 'Invalid username or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred during login' });
      }
      return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
    });
  })(req, res, next);
});

app.post("/api/register", validateInputs, checkNotAuthenticated, async (req, res) => {
  try {

    const { firstName, lastName, email, password, role } = req.body;
    // const user = ;
    if (await User.getUserByEmail(email)) {

      return res.status(400).json({ errors: [{ "type": "field", "value": email, "msg": "Email Already Exist", "path": "email" }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.addUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role
    })
    return res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch {
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// server logout!!!
app.delete("/api/logout", (req, res) => {

  // req.session.destroy()
  // req.logOut((err) => {
  //     if (err) {
  //         console.error(err);
  //         return res.status(500).send(err);
  //     }
  //     return res.json({message: "Logged OUT"})
  // });

  req.logout(() => {
    res.end();
  });

});

//google auth routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
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

app.post('/create-payment-intent', async (req, res) => {
  const { cart, shipping_fee, total_amount } = req.body;

  const shipping = {
    name: 'John Doe', // Customer's name for delivery
    address: {
      line1: '123 Main St', // Customer's street address
      city: 'Anytown', // Customer's city
      // state: 'CA', // Customer's state
      // postal_code: '12345', // Customer's postal code
      country: 'US' // Customer's country code
    }
  }
  console.log('cartaa', cart)
  const calculateOrderAmount = () => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return shipping_fee + total_amount;
  };

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      currency: 'usd',

      shipping
    });


    // console.log('intent req success')
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/placeOrder', checkAuthenticated, placeOrder);


//? This route for test middlewares/auth etc..
app.get('/auth/protected', checkAuthenticated, (req, res) => {
  let email = req.user.email;
  console.log('req.user.id', req.user.id)
  res.send(`Hello ${email}`);
})



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.post('/upload', upload.single('image'), (req, res) => {
  const path = req.file.path;

  cloudinary.uploader.upload(path, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Image upload failed' });
    }
    res.status(200).json({ url: result.secure_url });
  });
});


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
