var passport=require('passport')
var FacebookStrategy=require('passport-facebook').Strategy
var customers=require('../models/customer')
var LocalStrategy=require('passport-local').Strategy;
var TwitterStrategy=require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use('local-signUp',new LocalStrategy({
  usernameField:'email',
  passwordField:'password'

},function(req,email,password,done){

}))

passport.use('facebook-signUp',new FacebookStrategy({
   clientID:'836331249891333',
   clientSecret:'dc5ba532c6f4e5de3680fb0d4fa20cb3',
   callbackURL: "http://localhost:8980/client/facebookCallback"
},function(accessToken, refreshToken, profile, done){
    var customer={
      firstName:profile.name.givenName,
      lastName:profile.name.familyName,
      email:profile.emails[0].value,
      status:'verified',
      joiningTime:new Date()
    }
     var register=customers.signup(customer);
    register.then(function(results){
       var callCustomer=customers.customerByemail(customer.email)
      callCustomer.then(function(results){
        var umukiliya={
          id:results[0].customerID,
          firstName:results[0].firstName,
          lastName:results[0].lastName,
          email:results[0].email,
          phone:results[0].telephone,
          image:''
        }
        return done(null,umukiliya)
      })
    }).catch(function(error){
      return done(null,false,{message:'You already signed up please login!'})

    })

}))

passport.use('twitter-signUp',new TwitterStrategy({
  consumerKey: "8gTwpaA1XBt6pwHRilqWpjbV3",
  consumerSecret: "1eRbbkj28y3AtQBIpBfLU6CUJ0HCZgMOzyKdQbfiJG513dsym4",
  callbackURL: "http://localhost:8980/client/twitterCallback"
},function(accessToken, refreshToken, profile, done){
     var customer={
       firstName:profile.displayName,
       status:'verified',
       twitterID:profile.id,
       joiningTime:new Date()
     }
     var register=customers.signup(customer);
     register.then(function(results){
       var callCustomer=customers.byTwitter(customer.twitterID)
       callCustomer.then(function(results){
         var umukiliya={
           id:results[0].customerID,
           firstName:results[0].firstName,
           lastName:results[0].lastName,
           email:results[0].email,
           phone:results[0].telephone,
           image:''
         }
        return done(null,umukiliya)
       })
     }).catch(function(error){
        return done(null,false,{message:'You already signed up please login!'})
      })
  /*  console.log(profile.displayName)
    console.log(profile.username)
    console.log(profile.email)*/
  }
))


passport.use('google-signUp',new GoogleStrategy({
    clientID: "212987675787-6ans72jgiq1lq2uielhuipuqk56dn82q.apps.googleusercontent.com",
    clientSecret: "8X__tgTMHseizYtNSTqPKBLA",
    callbackURL: "http://localhost:8980/client/googleCallback"
  },function(accessToken, refreshToken, profile, done) {

    var customer={
      firstName:profile.name.familyName,
      lastName:profile.name.givenName,
      email:profile.emails[0].value,
      lastIpaddress:'',
      status:'verified',
      joiningTime:new Date()
    }
    var register=customers.signup(customer);

    register.then(function(results){
       var callCustomer=customers.customerByemail(customer.email)
      callCustomer.then(function(results){
        var umukiliya={
          id:results[0].customerID,
          firstName:results[0].firstName,
          lastName:results[0].lastName,
          email:results[0].email,
          phone:results[0].telephone,
          image:''
        }
        return done(null,umukiliya)
      })
    }).catch(function(error){
      return done(null,false,{message:'You already signed up please login!'})

    })


      /* User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id }, function (err, user) {
         return done(err, user);
       });*/
  }
));

passport.serializeUser(function(user, done){
     done(null, user.id);
     console.log(user)
});

passport.deserializeUser(function(id, done){
  var User= customers.theCustomer(id);//checkPass.thisUser(id)//oneShop.specificShop(id);
    User.then(function(results){
      done(null,results);
    })
   }
  );
module.exports=passport;
