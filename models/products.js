var mysql=require('mysql');
var poolConfig=require('../mysqlConfig')
var pool=mysql.createPool(poolConfig.database);


function addProduct(product){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('insert into products set ?',product,function(err,results){
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

function updateProduct(productID,product){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('update products set? where productID=?',[product,productID],function(err,results){
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
/*function viewVariations(productID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('select * from variants where productID=?',[productID],function(err,results){
        connection.release();
        if(err){
          reject(err)
        }else{
          resolve(results)
        }
      })
    })
  })
}*/
function viewSizes(productID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('select * from sizes where productID=?',[productID],function(err,results){
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
function viewColors(productID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('select * from colors where productID=?',[productID],function(err,results){
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
function  createColors(variant){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);

      connection.query('insert into colors set?',variant,function(err,results){
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
function  createSize(variant){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);

      connection.query('insert into sizes set?',variant,function(err,results){
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
/*function  createVariation(variant){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);

      connection.query('insert into variants set?',variant,function(err,results){
        connection.release();
        if(err){
          reject(err)
        }else{
          resolve(results)
        }
      })
    })
  })
}*/
function removeColor(variationID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('delete from colors where colorID=?',variationID,function(err,results){
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
function removeSize(variationID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('delete from sizes where sizeID=?',variationID,function(err,results){
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
 /*function removeVariation(variationID){
   return new Promise(function(resolve,reject){
     pool.getConnection(function(error,connection){
       if(error)reject(error);
       connection.query('delete from variants where variationID=?',variationID,function(err,results){
         connection.release();
         if(err){
           reject(err)
         }else{
           resolve(results)
         }
       })
     })
   })
 }*/
function changeStatus(productID,theStatus){
      function status(){
        var outCome
        if(theStatus=='Availlable'){
          outCome='Out of stock'
        }else{
          outCome='Availlable'
        }
        return outCome;
      }
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);

      connection.query('update products set status=? where productID=?',[status(),productID],function(err,results){
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
function editButton(productID,btnStatus){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);

      connection.query('update products set btnVisibility=? where productID=?',[btnStatus,productID],function(err,results){
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
function productByShop(shopID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('select * from products where shopID=?',[shopID],function(err,rows,fields){
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

function productByID(productID){
  return new Promise(function(resolve,reject){
    pool.getConnection(function(error,connection){
      if(error)reject(error);
      connection.query('select * from products where productID=?',[productID],function(err,rows,fields){
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
module.exports.button=editButton;
module.exports.editProduct=updateProduct;
//module.exports.deletVariation=removeVariation;
module.exports.deleteColor=removeColor;
module.exports.deleteSize=removeSize;
//module.exports.variations=viewVariations;
module.exports.colors=viewColors;
module.exports.sizes=viewSizes;
//module.exports.variate=createVariation;
module.exports.colorIt=createColors;
module.exports.sizeIt=createSize;
module.exports.change=changeStatus;
module.exports.allProducts=productByShop;
module.exports.oneProduct=productByID;
module.exports.addIt=addProduct;
//module.exports.addproduct=addProduct;
