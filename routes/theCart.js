var express=require('express')
var app=express();

var cart=require('../models/cart')

var allCategories=require('../models/categories')
var oneShop=require('../models/shopByID')
var theProduct=require('../models/products')

app.post('/',function(req,res,next){
  var newProduct={
    sessionID:req.sessionID,
    productID:req.body.productid,
    productName:req.body.productname,
    quantity:1,
    unitPrice:req.body.theprice,
    unitMeasure:req.body.unit,
    currency:req.body.thecurrency,
    theshopID:req.body.theshopID,
    productImg:req.body.productIMG

  }
 console.log(req.body)
//method to add to cart a new product and updating its quantity
/*   var dataPacket;
  var allFromCart=cart.allItems(newProduct.sessionID);

   var itemByID=cart.allItemsbyID(newProduct.sessionID,newProduct.productID);
   itemByID.then(function(results){
     var oldID=results.productID;
//if the product is alredy in the cart
     if(oldID==newProduct.productID){

       var oldProduct={
         quantity:results.quantity+1,
       }

       var updateItem=cart.update(oldProduct.quantity,newProduct.sessionID,newProduct.productID)
       updateItem.then(function(result){
         //get the real number of items in the cart
         var itemsNo=cart.itemNumbers(newProduct.sessionID);
           itemsNo.then(function(resultats){

             var jsonCount=JSON.stringify(resultats);
             dataPacket=resultats;
            // res.send(jsonCount);
               console.log(jsonCount);
           }).catch(function(err){
             res.send(err)
           })
       })
     }else{
       //if it is the first time the product is added in the cart
      var addToCart= cart.addCart(newProduct);
      addToCart.then(function(result){
        var itemsNo=cart.itemNumbers(newProduct.sessionID);
        itemsNo.then(function(resultats){
          dataPacket=resultats;
        //  res.send(resultats);
         console.log(resultats)
        })
      })
     }
   }).catch(function(err){
     console.log('there is error:'+err);
     res.send(err);
   })
  res.send(dataPacket)*/
})

module.exports=app;
