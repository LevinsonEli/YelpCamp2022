if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils2/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { mainModule } = require('process');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/yelp-camp';
const sessionConfigSecret = process.env.SESSION_SECRET || 'mysecret';

const port = process.env.PORT || 3000;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database conected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(mongoSanitize());

const sessionStore = MongoStore.create({
    mongoUrl: dbUrl,
    secret: sessionConfigSecret,
    touchAfter: 24 * 360
});
sessionStore.on('error', function(err) {
    console.log('Session store error.');
})

const sessionConfig = {
    //name: 'mysession',    // instead of 'session_id'
    secret: sessionConfigSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,    // https - not for localhost
        expires: Date.now() + 1000 * 360 * 24 * 7,   // One week
        maxAge: 1000 * 360 * 24 * 7
    },
    sessionStore
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy: false})); // not for localhost

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.get('/', (req, res) => {
    return res.render('home');
})

app.get('*', (req, res, next) => {
    return next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    console.log(err);
    const { 
        statusCode = 500, 
        message = `Something went wrong: ${err}`
    } = err;
    res.status(statusCode).render('error', { message });
})


app.listen(port, () => {
    console.log(`Listening of port ${port}`)
})