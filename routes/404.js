var express=require('express')
var app=express();
var allCategories=require('../models/categories')

app.get('*',function(req,res,next){
   var kategori=allCategories.finalObject;
   res.render('pageNotFound',{title:'Page Not Found',category:kategori})
})

module.exports=app;
