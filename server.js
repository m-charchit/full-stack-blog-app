const express = require('express')
const app = express()
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')
const flash = require('express-flash-messages')
const mongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const passport = require("passport")
const bodyParser = require('body-parser')


const User = require('./models/users')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require("./routes/user")
const mongoDbUri = 'mongodb://localhost/test'


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.set("layout extractStyles", true)
app.set("layout extractScripts", true)
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(flash())
app.use(
	session({
	  secret: "process.env.SECRET",
	  resave: false,
	  saveUninitialized: true,
	  store: mongoStore.create({
		mongoUrl: mongoDbUri
	})
	})
  );
app.use(express.urlencoded({extended : false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
  });
  
mongoose.connect(mongoDbUri, {useNewUrlParser: true});

const db = mongoose.connection

db.on('error', error => console.error(error))

db.once("open",()=>{
	console.log("succesfully connected to mongodb")
})
// @ts-ignore
passport.use(User.createStrategy());
// @ts-ignore
passport.serializeUser(User.serializeUser());
// @ts-ignore
passport.deserializeUser(User.deserializeUser());

app.use("/",indexRouter)
app.use("/auth",authRouter)
app.use("/post",postRouter)
app.use("/user",userRouter)

app.listen(process.env.PORT || 3000)