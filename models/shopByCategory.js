var express=require('express');
var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var q=require('q');
var pool=mysql.createPool(poolConfig.database);

    //not working to be tried after
   function shopByCategory(categID){
        return new Promise(function(resolve,reject){
          pool.getConnection(function(err,connection){
            if(err)reject(err);
            connection.query('select * from shop where categoryID=?',[categID],function(err,results){
              if(err){
                reject(err);
              }else{
                resolve(results);
              }

            })
          })
        })
   }

     //the same method using callback still not working
    var specific=function(categID){
        pool.getConnection(function(err,connection){
          if(err)throw err;
          connection.query('select * from shop where categoryID=?',[categID],function(err,results){
             connection.release();
             if(err){
              return  null;
             }else{
              return results;
             }
          })
        })
      }
  /*function specificShop(categID){
     var promiseBag=shopByCategory(categID);
     return promiseBag;
   }*/

   //used to get all shops it works perfectly
         function getShops(){
           return new Promise(function(resolve,reject){
             pool.getConnection(function(err,connection){
               if(err)reject(err);
               connection.query('select * from shop',function(err,results){
                  connection.release();
                 if(err){
                   reject(err);
                 }else{
                   resolve(results);
                 }
               })
             })
           })
         }

        //to save the shop myObject
        function insertShop(shopObject){
          return new Promise(function(resolve,reject){
            pool.getConnection(function(error,connection){
              if(error)throw error;
              connection.query('insert into shop set?',shopObject,function(err,results){
                 connection.release();
                if(err){
                  reject(err);
                }else{
                  resolve(results);
                }
              })
            })
          })
        }
        function saveShopPromise(shopObject){
          var promiseBag=insertShop(shopObject);
          return promiseBag;
        }

module.exports.allShops=getShops;
module.exports.shop=shopByCategory;
module.exports.specific=specific;
module.exports.saveShop=saveShopPromise;
