var express=require('express');
var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var pool=mysql.createPool(poolConfig.database);
var bcrypt=require('bcrypt')
var app=express();



  //retrieving email password to be compared in the passport
     function retrieveCredentials(email){
      return new Promise(function(resolve,reject){
        pool.getConnection(function(err,connection){
           if(err)throw err;
          connection.query('select email,password,shopID from shop where email=?',[email],function(err,rows,fields){
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



  function activateMyAccount(tockenID){
     var shopID;
    return new Promise(function(resolve,reject){
      pool.getConnection(function(error,connection){
        if(error)reject(error);
        connection.query('select shopID,tocken from shop where tocken=?',[tockenID],function(err,rows,fields){
          connection.release();
          if(err){
            reject(err);
          }else{
            if(rows.length>0){
              shopID=rows[0].shopID;
              var status='Verified';
              connection.query('update shop set status="'+status+'",tocken="ok" where shopID=?',[shopID],function(err,results){
                //connection.release();
                if(err){
                  reject(err);
                }else{
                  resolve(results);
                }
              })
            }else{
              reject(null);
            }
          }
        })
      })
    })
  }
     function activationPromise(tockenID){
       var promiseBag=activateMyAccount(tockenID);
        return promiseBag;
     }
module.exports.activation=activationPromise;
module.exports.userPassword=retrieveCredentials;
