const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')

const mongoose = require('mongoose');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended : false}));
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

const db = mongoose.connection

db.on('error', error => console.error(error))

db.once("open",()=>{
	console.log("succesfully connected to mongodb")
})
app.use("/",indexRouter)
app.use("/user",userRouter)

app.listen(process.env.PORT || 3000)