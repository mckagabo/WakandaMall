var express=require('express');
var app=express();
var fs=require('fs')
var category;
var bcrypt=require('bcrypt')
var nodemailer=require('nodemailer')
var allCategories=require('../models/categories');
var allShops=require('../models/shopByCategory')
const saltRounds=10;
var randomToken=require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
var randoNumber=Math.floor((Math.random()*100)+54);//to be added on the tocken just for my own sofistication
var smtpTransport=nodemailer.createTransport({
  service:"Gmail",
  auth:{
    user:'gogosfood1@gmail.com',
    pass:'gogosfood12'
  }
});
var mailOptions,host,link;

var hashMyPassword;//testingHashing;


app.post('/register',function(req,res,next){
  //var salt=bcrypt.genSaltSync(saltRounds);   //the salt to add on our passowrd
//=bcrypt.hashSync(req.body.password, salt);//Creating a hashed password
  var thePicture=req.files.theLogo;
  var picName=randomToken(10)+req.files.theLogo.name;//the name of image to be uploaded
  var imgExtension=req.files.theLogo.name.split('.').pop();
  var theToken=randomToken(64)+randoNumber;



  //---Beginning of the promise
  /* function hashMyPassword(password){
     return new Promise(function(resolve,reject){
       bcrypt.hash(password, saltRounds, function(err, hash) {
         if(err){
           reject(err);
         }else{
           resolve(hash);
         }
       });

     })

   }

  var promiseBag=hashMyPassword('kagabo');
    promiseBag.then(function(results){
        testingHashing=result;
        return testingHashing;
    }).catch(function(err){
       return err;
    });*/

  //---------------- Begining of hashing the password using async way
  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
   var kategori=allCategories.finalObject;
    var shop={
      firstName:req.body.first_name,
      lastName:req.body.last_name,
      telephone:req.body.phone,
      email:req.body.email,
      shopName:req.body.businessName,
      shopLogo:picName,
      description:req.body.description,
      password:hash,
      status:'Not verified',
      tocken:theToken,
      categoryID:req.body.businessType
    }

      req.checkBody('first_name','Your first name is required').notEmpty();
      req.checkBody('last_name','Your last name is required too').notEmpty();
      req.checkBody('phone','Phone number required').notEmpty();
      req.checkBody('email','Email is required').isEmail();
      req.checkBody('businessName','The name of the business is required').notEmpty();
      req.checkBody('description','The description is required').notEmpty();
      req.checkBody('businessType','You must select a business type').notEmpty();
      req.checkBody('password','the password must be at least 6 character').isLength({min:6});
      req.checkBody('password_confirmation','passwords do not match').equals(req.body.password);

      var errors=req.validationErrors();
    
       if(!errors){

           //starting to validate images
           if(imgExtension=='jpg'||imgExtension=='png'||imgExtension=='jpeg'||imgExtension=='gif'||imgExtension=='JPG'){
             //when all is well we are starting the process to Register
             var saveShopPromise=allShops.saveShop(shop);
             saveShopPromise.then(function(results){
               thePicture.mv('Public/images/businessLogo/'+shop.shopLogo,function(err){
                 if(err){
                    req.flash('error','Error saving images please try again!');
                 }else{
                   //when the whole process is successfull; we start sending verification email to the customer
                   host=req.get('host');
                   link="http://"+host+"/verify?id="+shop.tocken;
                   mailOptions={
                     to:shop.email,
                     subject:'Please confirm your email',
                     html:'Hello '+shop.firstName+'!<br> Please click on the link to verify your email.<br><a href='+link+'>Click here!</a>'
                   }
                   //sending the verification email to the customer(shop owner);
                   smtpTransport.sendMail(mailOptions,function(error,response){
                     if(error){
                       req.flash('error',error);
                         res.render('signUp',{title:'Registered',category:kategori});
                     }else{
                       //when every thing is successfull
                       req.flash('info','Please consult your email to verify your account!');
                         res.render('signUp',{title:'Registered',category:kategori});
                     }
                   })

                 }
               })

             }).catch(function(err){
               //in case the object can't be saved to the shop!
               req.flash('error','This email already exist!'+err);
                  res.render('signUp',{title:'Registered',category:kategori});
             })
          /*   req.getConnection(function(err,connection){
               if(err)throw err;
               connection.query('insert into shop set?',shop,function(err,results){
                 if(err){
                   req.flash('error','This email already exist!');
                      res.render('signUp',{title:'Registered',category:kategori});
                 }else{
                   thePicture.mv('Public/images/businessLogo/'+shop.shopLogo,function(err){// starting to save image into the folder
                     if(err){
                       req.flash('error','This email already exist!');
                         res.render('signUp',{title:'Registered',category:kategori});
                     }else{
                       //when the whole process is successfull; we start sending verification email to the customer
                       host=req.get('host');
                       link="http://"+host+"/verify?id="+shop.tocken;
                       mailOptions={
                         to:shop.email,
                         subject:'Please confirm your email',
                         html:'Hello '+shop.firstName+'!<br> Please click on the link to verify your email.<br><a href='+link+'>Click here!</a>'
                       }
                       smtpTransport.sendMail(mailOptions,function(error,response){
                         if(error){
                           req.flash('error',error);
                             res.render('signUp',{title:'Registered',category:kategori});
                         }else{
                         console.log("Message sent: "+response.messages);
                         req.flash('info','Please consult your email to verify your account!');
                           res.render('signUp',{title:'Registered',category:kategori});
                         }
                       })

                     }
                   });
                 }
               })
             })*/


           }else{
             req.flash('error','only images are can be uploaded as business logo');
              res.render('signUp',{title:'Registered',category:kategori});
           }

       }else{
         var errMsg='';

           //starting to validate images
           if(imgExtension=='jpg'||imgExtension=='png'||imgExtension=='jpeg'||imgExtension=='gif'||imgExtension=='JPG'){
             errors.forEach(function(err){
               errMsg+=err.msg+'<br>'
             })
             req.flash('error',errMsg);
               res.render('signUp',{title:'Registration failed',category:kategori});
           }else{
             errors.forEach(function(err){
               errMsg+=err.msg+'<br>'
             })
             req.flash('error',errMsg+'<br>'+'Only images are allowed to be uploaded!');
               res.render('signUp',{title:'Registration failed',category:kategori});
           }

       }



  })


//   console.log('The file type is:'+req.files.theLogo.name.split('.').pop()+'And the new name is:'+picName+'and the random number is:'+randoNumber);
    console.log('every thing ok')
  //  console.log(hash);

  });// end of the bcrypt ting
module.exports=app;
