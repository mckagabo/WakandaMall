var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var pool=mysql.createPool(poolConfig.database);

function updateCart(quantity,sessionID,productID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(err,connection){
      if(err)reject(err);
      connection.query('update cart set quantity=? where sessionID=? and productID=?',[quantity,sessionID,productID],function(err,results){
        connection.release();
        if(err){
          reject(err)
        }else{
          resolve(results);
        }
      })
    })
  })
}

function addToCart(product){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(err,connection){
      if(err)reject(err);
      connection.query('insert into cart set?',product,function(err,results){
        connection.release();
        if(err){
          reject(err)
        }else{
          resolve(results);
        }
      })
    })
  })
}

function howManyItems(sessionID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(err,connection){
      if(err)reject(err);
      connection.query('select sum(quantity) as total from cart where sessionID=?',sessionID,function(error,results){
        connection.release();
        if(error){
          reject(error);
        }else{
          resolve(results);
        }
      })
    })
  })
}
function itemByID(sessionID,productid){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(err,connection){
      if(err)reject(err)
      connection.query('select * from cart where sessionID=? and productID=?',[sessionID,productid],function(error,rows,fields){
        connection.release();
        if(error){
          reject(error)
        }else{
         if(rows.length>0){
           var product={
            productID:rows[0].productID,
            quantity:rows[0].quantity,
           }
           resolve(product);
         }else{
           var productID=0;
           resolve(productID);
         }
        }
      })
    })
  })
}
function allItemsInCart(sessionID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(err,connection){
      if(err)reject(err)
      connection.query('select * from cart where sessionID=?',sessionID,function(error,rows,results){
        connection.release();
        if(error){
          reject(error)
        }else{
          resolve(results);
        }
      })
    })
  })
}
module.exports.allItemsbyID=itemByID;
module.exports.update=updateCart;
module.exports.addCart=addToCart;
module.exports.itemNumbers=howManyItems;
module.exports.allItems=allItemsInCart;
