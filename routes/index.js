var express=require('express')
var app=express();
var index=require('./shops')
var signUp=require('./signUpResults');
var verifyMe=require('./verifications')
var dashBoard=require('./dashBoardActivities')
var customers=require('./clients')
var cart=require('./theCart')
var pageNotFound=require('./404')

app.use('/',index);
app.use('/signUpResults',signUp);
app.use('/verify',verifyMe);
app.use('/Dashboard',dashBoard);
app.use('/client',customers);
app.use('/cart',cart);
app.use('*',pageNotFound);

module.exports=app;
