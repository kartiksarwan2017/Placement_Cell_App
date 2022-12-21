const express = require('express');
const env =  require('./config/environment');
const logger = require('morgan');
const path  = require('path');
const PORT = process.env.PORT || 8000;
const app = express();
require('./config/view-helpers')(app);
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportGithub = require('./config/passport-github-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMiddlware = require('./config/middleware');

if(env.name == 'development'){
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, 'scss'),
      dest: path.join(__dirname, env.asset_path, 'css'),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

app.use(express.urlencoded({ extended: true }));

// setting up cookie parser
app.use(cookieParser());

app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);



// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Mongo Store is used to store the session cookie in the db
app.use(session({
  name: 'employee',
  //TO DO change the secret before deployment in production mode
  secret: env.session_cookie_key,
  saveUninitialized: false,
  resave: false,
  coookie: {
    maxAge: (1000 * 60 * 100)
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    autoRemove: 'disabled'
  },
  function(err){
    console.log(err || 'connect-mongodb setup ok');
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddlware.setFlash);


// use express router
app.use('/', require('./routes'));


app.listen(PORT, (err) => {
    if(err){
        console.log(`Error in running server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${PORT}`);
});