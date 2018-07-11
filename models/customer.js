var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var pool=mysql.createPool(poolConfig.database);


  function signUp(customer){
    return new Promise(function(resolve,reject){
      pool.getConnection(function(error,connection){
        if(error)reject(error);
        connection.query('insert into customers set ?',customer,function(err,results){
          connection.release();
          if(err){
            reject(err)
          }else{
            resolve(results)
          }
        })
      })
    })
  }

  function specificCustomer(customerID){
     return new Promise(function(resolve,reject){
       pool.getConnection(function(error,connection){
          if(error)reject(error);
          connection.query('select * from customers where customerID=?',[customerID],function(err,rows,fields){
            connection.release();
            if(err){
              reject(err)
            }else{
              if(rows.length>0){
                resolve(rows)
              }else{
                reject(rows)
              }
            }
          })
       })
     })
  }

  function customerByTwitterID(twitterID){
    return new Promise(function(resolve,reject){
      pool.getConnection(function(error,connection){
         if(error)reject(error);
         connection.query('select * from customers where twitterID=?',[twitterID],function(err,rows,fields){
           connection.release();
           if(err){
             reject(err)
           }else{
             if(rows.length>0){
               resolve(rows)
             }else{
               reject(rows)
             }
           }
         })
      })
    })
  }
  function customerByEmail(email){
     return new Promise(function(resolve,reject){
       pool.getConnection(function(error,connection){
          if(error)reject(error);
          connection.query('select * from customers where email=?',[email],function(err,rows,fields){
            connection.release();
            if(err){
              reject(err)
            }else{
              if(rows.length>0){
                resolve(rows)
              }else{
                reject(rows)
              }
            }
          })
       })
     })
  }
module.exports.signup=signUp;
module.exports.theCustomer=specificCustomer;
module.exports.customerByemail=customerByEmail;
module.exports.byTwitter=customerByTwitterID;
