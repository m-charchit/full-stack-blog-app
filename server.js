
const express = require('express')
const app = express()
const passport = require("passport")
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const flash = require('express-flash-messages')


const User = require('./models/users')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/auth')

const mongoose = require('mongoose');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(flash())
app.use(
	session({
	  secret: "process.env.SECRET",
	  resave: false,
	  saveUninitialized: true,
	})
  );
app.use(express.urlencoded({extended : false}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

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
app.use("/auth",userRouter)

app.listen(process.env.PORT || 3000)


