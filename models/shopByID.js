var express=require('express');
var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var pool=mysql.createPool(poolConfig.database);
var app=express();


    function selectShopByID(shopID){
       return new Promise(function(resolve,reject){
         pool.getConnection(function(error,connection){
           if(error)throw error;
           connection.query('select * from shop where shopID=?',[shopID],function(err,rows,fields){
             connection.release();
             if(err){
               reject(err);
             }else{
               if(rows.length>0){
                 resolve(rows);
               }else{
                 reject(rows);
               }
             }
           })
         })
       })
    }
      //this is the function that return the promise
     function specificShop(shopID){
       var promiseBag=selectShopByID(shopID);
       return promiseBag;
     }


module.exports.specificShop=specificShop;
