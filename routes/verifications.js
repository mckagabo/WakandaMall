var express=require('express')
var app=express();
var allCategories=require('../models/categories');
var activate=require('../models/accountVerification');
var passport=require('../Middelwares/passportAuthentication')
//Simply calling the login page
/*app.get('/login',function(req,res,next){
   var category=allCategories.finalObject;
  res.render('businessLogin',{title:'LOGIN',category:category});

})*/
  //dealing with authentification
  app.post('/login',passport.authenticate('local-login',{
    successRedirect:'/Dashboard',
    failureRedirect:'/verify/login',
    failureFlash:true
  }))

//what happen after validating the account
app.get('/',function(req,res,next){
  var theTocken=req.query.id;
  //Getting all the categories in the system
     var category=allCategories.finalObject;
  var activationPromise=activate.activation(theTocken);

   activationPromise.then(function(result){
     req.flash('success','Your account was successfully verified!')
     res.render('businessLogin',{title:'LOGIN',category:category});
   }).catch(function(err){
     req.flash('info','Your account was verified before')
     res.render('businessLogin',{title:'LOGIN',category:category});
   })



/* req.getConnection(function(err,connection){
    if(err)throw err;
    //---------Begining of querying categories from the db
     var category=allCategories.finalObject;
  //===========================================================
  theTocken=req.query.id;
   connection.query('select shopID,tocken from shop where tocken=?',theTocken,function(err,rows,fields){
     if(err){
       req.flash('error','Sorry! register again')
       res.render('businessLogin',{title:'LOGIN',category:category});
     }else{
        if(rows.length>0){
          theShopID=rows[0].shopID;
        //We start updating the status of the account to verified
        var status='Verified';
        connection.query('update shop set status="'+status+'",tocken="ok" where shopID=?',theShopID,function(err,results){
          if(err)throw err;
          req.flash('success','Your account was successfully verified!')
          res.render('businessLogin',{title:'LOGIN',category:category});

        })
        }else{
          req.flash('info','This account has been verified before!')
          res.render('businessLogin',{title:'LOGIN',category:category});
        }
     }
   })

 })*/

});

module.exports=app;
