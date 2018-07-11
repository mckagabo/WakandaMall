module.exports=function isLoggedIn(req,res,next){
         if(req.isAuthenticated())
          return next();
      //in case they are not isAuthenticated
          res.redirect('/verify/login');
}
