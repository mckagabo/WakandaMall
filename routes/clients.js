var express=require('express');
var app=express();
var allCategories=require('../models/categories')
var passport=require('../Middelwares/customerAuth')


app.get('/',function(req,res,next){
   var categories=allCategories.finalObject
    res.render('clientSignup',{title:'Join us',category:categories});

})

app.get('/fcbkSignUp',passport.authenticate('facebook-signUp'))
app.get('/facebookCallback',passport.authenticate('facebook-signUp',{
  successRedirect:'/',
  failureRedirect:'/client',
  failureFlash : true
}))

app.get('/twitterSignup',passport.authenticate('twitter-signUp',{scope:['profile','email']}))
app.get('/twitterCallback',passport.authenticate('twitter-signUp',{
  successRedirect:'/',
  failureRedirect:'/client',
  failureFlash : true
})
/*  function(req,res){
  res.redirect('/');
}*/)
app.get('/googleSignup',passport.authenticate('google-signUp',{scope:['profile','email']}))
app.get('/googleCallback',passport.authenticate('google-signUp',{
  successRedirect:'/',
  failureRedirect:'/client',
  failureFlash : true
}))
module.exports=app;
