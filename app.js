// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }
require('dotenv').config();


const express = require('express');
const path = require('path')
const Joi = require('joi')
const mongoose = require('mongoose')
const Campground = require('./views/models/campground');
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas')
const Review = require('./views/models/review')
const  flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./views/models/user')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
const MongoStore = require('connect-mongo');





// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const app = express();

console.log(app.env)
app.set('view engine', 'ejs')
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.use(express.static(path.join(__dirname, 'public')))

db = mongoose.connection;
db.on("error", console.error.bind(console, "connection ERROR"));
db.once("open", () => {
    console.log("Database connection open")
})
const store =  MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter:24 * 60* 60
})

store.on("error", function(e){
    console.log("STORE SESSION ERROR", e)
})
const sessionConfig =  {
    store,
    name:'session',
    secret:'thisshouldbeabettersecret!',
    resave:  false,
    SaveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
// ];
// const connectSrcUrls = [];
// const fontSrcUrls = [];

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize());


app.use((req,res,next) => {
   
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.anyUser = req.user;
    next();
})






app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})

//app.get('/fakeUser', async(req,res) =>{
    //const user = new User({email:"hariiiikrishna@gmail.com", username:"hariiii"})
    //const newUser =  await User.register(user, "chicken")
    //res.send(newUser);
//})




app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no! Something went wrong"
    res.status(statusCode).render('error', { err });
})




app.listen(3000, () => {
    console.log('Serving on port 3000')
})


