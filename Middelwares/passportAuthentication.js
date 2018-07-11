var express=require('express')
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy;
var bcrypt=require('bcrypt')
var checkPassword=require('../models/accountVerification')
var thisShop=require('../models/shopByID')


passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
  },function(email,password,done){
   var passwordPromise=checkPassword.userPassword(email);
   passwordPromise.then(function(results){
     var hashedPassword=results[0].password;
     var theEmail=results[0].email;
     var theShopID=results[0].shopID;
     bcrypt.compare(password,hashedPassword,function(err,isMatch){
       if(err){
         return done(null,false,{message:'invalid credentials'})
       }
       if(!isMatch){
         return done(null,false,{message:'wrong Password or email!'})
       }else{
          var umucuruzi={
            id:theShopID
          }
         return done(null,umucuruzi,{message:'correct:--'})
       }
     })
   }).catch(function(err){
     return done(null,false,{message:'INVALID CREDENTIALS'})
   })
}
)
);
passport.serializeUser(function(user, done){
     done(null, user.id);
});

passport.deserializeUser(function(id, done){
    var User=thisShop.specificShop(id);
    User.then(function(results){
      done(null,results);
    }).catch(function(err){
      done(null,false,{message:''+err})
    })
   }
  );

  module.exports=passport;
