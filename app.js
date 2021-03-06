require('dotenv').config();
const express = require("express");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const globalRoutes = require('./routes/globalRoutes');
const homeRoutes = require('./routes/homeRoutes');
const blogerRoutes = require('./routes/blogerRoutes');
const ExpressError = require('./utility/ExpressError');
const Bloger = require('./models/bloger');

// To inculde date of when the blog was created.
// If a known user want to inculde his name on global post. Here I can add that feature If you want to post with your penName included or anonomesly. Ignore spellings.
// I don't know. A blog that can be edited and deleted by anyone is little bit of for a feature.
// So I can do is No one can edited and delete a global posted route but can be reported for several reason that can be reviewed later and delete if neccessary. But for now that is good.
// Like button

const dbUrl = process.env.DB_URL;
// const dbUrl = "mongodb://localhost:27017/blogerDB";

const app = express();
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600
});
store.on('error', function(e) {
  console.log("SESSION STORE ERROR ", e);
});
const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000*60*60*27*7,
    maxAge: 1000*60*60*27*7
  }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({ usernameField: 'blogername' }, Bloger.authenticate()));
passport.serializeUser(Bloger.serializeUser());
passport.deserializeUser(Bloger.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/global', globalRoutes);
app.use('/bloger/:blogername', blogerRoutes);
app.use('/', homeRoutes);

app.all('*', function(req, res, next) {
  next(new ExpressError(404, 'Page Not Found'));
})

app.use(function(err, req, res, next){
  const { statusCode = 500, message} = err;
  if(!message) {
    err.message = 'Something is not right. Sorry!';
  }
  res.status(statusCode).send(message);
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`Server running on port ${port}`);
});