var express=require('express');
var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var pool=mysql.createPool(poolConfig.database);
var app=express();

   function getCategories(){
     return new Promise(function(resolve,reject){
         pool.getConnection(function(err,connection){
           if(err) reject(err);
           connection.query('select * from categories',function(err,results){
             if(err){
               reject(err);
             }else{
               resolve(results);
             }
           })
         })
     })
   }
   var value;
  var thePromise=Promise.resolve(getCategories());
    thePromise.then(function(myObject){
      module.exports.finalObject=myObject;
    })
  /*function callCategories(callback){
    pool.getConnection(function(err,connection){
      if(err)throw err;
      connection.query('select * from categories',function(err,results){
           if(err){
             callback(err,null);
           }else{
             callback(null,results);
           }
      })
    })
  }*/

module.exports.categories=getCategories();
