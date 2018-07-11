var express=require('express')
var app=express();
//var bcrypt=require('bcrypt')
var allCategories=require('../models/categories')
var oneShop=require('../models/shopByID')
var theProduct=require('../models/products')
 var amaduka=require('../models/shopByCategory');
 var isLoggedIn=require('../Middelwares/loginStatus');
  let categories;
  var themShops,testingHashing;
  var randomToken=require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

app.get('/',function(req,res,next){
 //getting all the shops
   req.session.passport=null;
 var allShops=amaduka.allShops();
 var kategori=allCategories.finalObject;
  allShops.then(function(results){
      res.render('index',{title:'Wakanda mall',category:kategori,shops:results});

  }).catch(function(err){
      res.render('index',{title:'Wakanda mall',category:kategori,shops:''});
      console.log(err);
  })

})

app.get('/signUp',function(req,res){
   var kategori=allCategories.finalObject;
  res.render('signUp',{title:'Sign up',category:kategori})
})


//selecting values from a specific shop
app.get('/shops/:shopName/:shopID',function(req,res){
    var theShopID=req.params.shopID; //req.query.id;
    var theshopName;
     var kategori=allCategories.finalObject;
     var shopPromise=oneShop.specificShop(theShopID);
      var products=theProduct.allProducts(theShopID);
      var color=theProduct.colors(theShopID);
      var size=theProduct.sizes(theShopID);
      shopPromise.then(function(results){

        theshopName=req.params.shopName;//results[0].shopName;
          products.then(function(ibicuruzwa){
                res.render('Shops',{shops:results,title:theshopName,category:kategori,products:ibicuruzwa})
          }).catch(function(err){
          res.render('Shops',{shops:results,title:theshopName,category:kategori,products:''})
          })


    }).catch(function(error){
      res.render('pageNotFound',{title:'Shop not found',category:kategori})
    })

})
//calling the product details
 app.get('/details/:shopName/:id',function(req,res){
   var kategori=allCategories.finalObject;
   var productid=req.params.id;
   var oneProduct=theProduct.oneProduct(productid);
   var theName=req.params.shopName;
   var colors=theProduct.colors(productid);
   var sizes=theProduct.sizes(productid);
    oneProduct.then(function(results){
       colors.then(function(values){
         function colorVisible(){
           var value;
           if(values.toString()==''){
              value='hidden'
           }else{
             value='true'
           }
           return value;
         }
         sizes.then(function(allsizes){
           function sizeVisible(){
             var value;
             if(allsizes.toString()==''){
                value='hidden'
             }else{
               value='true'
             }
             return value;
           }
           res.render('productDetails',{title:results[0].productName,category:kategori,product:results,shopName:theName,variation:values,colorsv:colorVisible(),sizesv:sizeVisible(),colors:values,sizes:allsizes})

         })
//  console.log('Hey'+values.toString())
}).catch(function(err){
    res.render('productDetails',{title:results[0].productName,category:kategori,product:results,shopName:theName,variation:'',visibility:'hidden'})
})

    }).catch(function(err){
        res.render('pageNotFound',{title:'Shop not found',category:kategori,variation:'',visibility:'hidden'})

    })

 })
//calling the business login page
app.get('/verify/login',function(req,res){
  var kategori=allCategories.finalObject;
res.render('businessLogin',{title:'Sign in',category:kategori})
})

//calling the dashboard
app.get('/Dashboard',isLoggedIn,function(req,res,next){
 var businessName=req.user[0].shopName;
 var businessLogo=req.user[0].shopLogo;
    res.render('Dashboard/index',{title:'Dashboard',business:businessName,userLogo:businessLogo});
})

//calling the upload form from the dashboard
app.get('/uploadForm',isLoggedIn,function(req,res,next){
  var businessName=req.user[0].shopName;
  var businessLogo=req.user[0].shopLogo;
     res.render('Dashboard/addProducts',{title:'Dashboard',business:businessName,userLogo:businessLogo});
})

//calling the Tables
app.get('/view',isLoggedIn,function(req,res,next){
  var businessName=req.user[0].shopName;
  var businessLogo=req.user[0].shopLogo;
  var shopID=req.user[0].shopID;
  var products=theProduct.allProducts(shopID);
   products.then(function(results){
    //   res.send(results)
      res.render('Dashboard/tables',{title:'Dashboard',business:businessName,userLogo:businessLogo,products:results});

   }).catch(function(err){
     console.log(err);
   })


})
//change the status of the product
 app.post('/changeStatus/:id/:status',function(req,res,next){
    var productID=req.params.id;
    var status=req.params.status;
   var changeStatus=theProduct.change(productID,status);
   changeStatus.then(function(results){
      res.redirect('/view');
   })
 })


app.get('/addVariation/:name/:id',isLoggedIn,function(req,res,next){
   var productID=req.params.id;
   var productName=req.params.name;
   var businessName=req.user[0].shopName;
   var businessLogo=req.user[0].shopLogo;
   var theType=req.params.type;
   var colorVariations=theProduct.colors(productID)
   var sizeVariation=theProduct.sizes(productID)

    colorVariations.then(function(colorResults){
      //res.render('Dashboard/variations',{title:'Dashboard',business:businessName,userLogo:businessLogo,product:productID,name:productName,variation:results});
      sizeVariation.then(function(sizeResults){
          res.render('Dashboard/variations',{title:'Dashboard',business:businessName,userLogo:businessLogo,product:productID,name:productName,colors:colorResults,sizes:sizeResults});
      })
    })



  /*  variations.then(function(results){
      res.render('Dashboard/variations',{title:'Dashboard',business:businessName,userLogo:businessLogo,product:productID,name:productName,variation:results});
    }).catch(function(err){
        res.render('Dashboard/variations',{title:'Dashboard',business:businessName,userLogo:businessLogo,product:productID,name:productName,variation:''});
    })*/


})
app.post('/addVariation/:id/:name/:type',function(req,res,next){
   var theType=req.params.type;
     var productid=req.params.id;
    var productName=req.params.name;
    var editButton=theProduct.button(productid,'hidden')
    if(theType=='color'){
      var color={
        productID:req.params.id,
        color:req.body.amabara
      }

      var colors=theProduct.colorIt(color);
      colors.then(function(results){
        editButton.then(function(resultats){
          req.flash('success',productName+' variation added')
          res.redirect('/addVariation/'+productName+'/'+productid)
        })
      })

    }else{
      var size={
        productID:req.params.id,
        size:req.body.size,
      }

          var sizes=theProduct.sizeIt(size);
          sizes.then(function(results){
            editButton.then(function(resultats){
              req.flash('success',productName+' variation added')
              res.redirect('/addVariation/'+productName+'/'+productid)
            })
          })
    }


  // var variation=theProduct.variate(variant);
  // var productid=variant.productID;
  /* variation.then(function(results){
     req.flash('success',productName+' variation added')
     res.redirect('/addVariation/'+productName+'/'+productid)
   }).catch(function(err){
        req.flash('error',productName+''+err)
      res.redirect('/addVariation/'+productName+'/'+productid)
   })*/
})
app.post('/removeVariant/:id/:product/:name/:types',function(req,res,next){
   var theType=req.params.types;
   var variationID=req.params.id;
   var name=req.params.name;
   var productID=req.params.product;
   var removeColor=theProduct.deleteColor(variationID);
   var removeSize=theProduct.deleteSize(variationID);
   var colors=theProduct.colors(productID);
   var sizes=theProduct.sizes(productID);
   var editButton=theProduct.button(productID,'true');
   if(theType=='color'){
     removeColor.then(function(results){
        res.redirect('/addVariation/'+name+'/'+productID)
     })
   }else{
     removeSize.then(function(results){
       res.redirect('/addVariation/'+name+'/'+productID)
     })
   }

  sizes.then(function(resultsi){
    function isSize(){
      var value;
      if(resultsi==''){
        value=false;
      }else{
        value=true;
      }
      return value;
    }
    colors.then(function(results){
      function isColor(){
        var value;
        if(results==''){
          value=false;
        }else{
          value=true;
        }
        return value;
      }
      if(!isSize() && !isColor()){
        editButton.then(function(resultats){
         console.log('we done it')
        })
      }
        //console.log(isSize()+'AND'+isColor())
    })


  })

   /*removeIt.then(function(results){
     res.redirect('/addVariation/'+name+'/'+productID)
   })*/

})
app.post('/addProduct',function(req,res,next){

     var pic1=req.files.pic1
      var pic2=req.files.pic2
        var pic3=req.files.pic3
         var pic4=req.files.pic4
         var picName1=randomToken(10)+req.files.pic1.name;
            var picName2=randomToken(10)+req.files.pic2.name;
               var picName3=randomToken(10)+req.files.pic3.name;
                  var picName4=randomToken(10)+req.files.pic4.name;
               var pic1Ext=req.files.pic1.name.split('.').pop();
              var pic2Ext=req.files.pic2.name.split('.').pop();
            var pic3Ext=req.files.pic3.name.split('.').pop();
       var pic4Ext=req.files.pic4.name.split('.').pop();

    function isPic1(){
      var image=true;
   if(pic1Ext=='jpg'||pic1Ext=='png'||pic1Ext=='jpeg'||pic1Ext=='gif'||pic1Ext=='JPG'){
     image=true;
   }else{
     image=false;
   }
   return image;
    }
    function isPic2(){
      var image=true;
   if(pic2Ext=='jpg'||pic2Ext=='png'||pic2Ext=='jpeg'||pic2Ext=='gif'||pic2Ext=='JPG'){
     image=true;
   }else{
     image=false;
   }
   return image;
    }
    function isPic3(){
      var image=true;
   if(pic3Ext=='jpg'||pic3Ext=='png'||pic3Ext=='jpeg'||pic3Ext=='gif'||pic3Ext=='JPG'){
     image=true;
   }else{
     image=false;
   }
   return image;
    }
    function isPic4(){
      var image=true;
   if(pic4Ext=='jpg'||pic4Ext=='png'||pic4Ext=='jpeg'||pic4Ext=='gif'||pic4Ext=='JPG'){
     image=true;
   }else{
     image=false;
   }
   return image;
    }

   var product={
     productName:req.body.productName,
     description:req.body.description,
     price:req.body.price,
     currency:req.body.currency,
     pic1:picName1,
     pic2:picName2,
     pic3:picName3,
     pic4:picName4,
     createdBy:req.user[0].firstName+'-'+req.user[0].lastName,
     creationTime:new Date(),
     unitMeasure:req.body.unit,
     status:'Availlable',
     shopID:req.user[0].shopID,
     btnVisibility:'true'
   }
  req.checkBody('productName','The product name is required').notEmpty();
  req.checkBody('price','price is required too').notEmpty();
  req.checkBody('description','please describe your product').notEmpty();
//  req.checkBody('pic1','must upload picture').notEmpty();
   var errors=req.validationErrors()
      if(!errors){
         if(isPic1() && isPic2() && isPic3() && isPic4()){
             //console.log(product);
              var addProduct=theProduct.addIt(product);
              addProduct.then(function(results){
                pic1.mv('Public/images/productImages/'+picName1,function(err){
                   if(err)req.flash('error','Error saving profile picture try again!');
                })
                pic2.mv('Public/images/productImages/'+picName2,function(err){
                   if(err)req.flash('error','Error saving profile picture try again!');
                })
                pic3.mv('Public/images/productImages/'+picName3,function(err){
                   if(err)req.flash('error','Error saving profile picture try again!');
                })
                pic4.mv('Public/images/productImages/'+picName4,function(err){
                   if(err)req.flash('error','Error saving profile picture try again!');
                })
                req.flash('success','A product was succesfully added');
                var businessName=req.user[0].shopName;
                var businessLogo=req.user[0].shopLogo;
                 res.render('Dashboard/addProducts',{title:'Dashboard',business:businessName,userLogo:businessLogo});
              }).catch(function(err){
                req.flash('error','Sory'+err);
                var businessName=req.user[0].shopName;
                var businessLogo=req.user[0].shopLogo;
                 res.render('Dashboard/addProducts',{title:'Dashboard',business:businessName,userLogo:businessLogo});
                 console.log(err);
              })
         }else{
           req.flash('error','Only images can be uploaded ');
           var businessName=req.user[0].shopName;
           var businessLogo=req.user[0].shopLogo;
            res.render('Dashboard/addProducts',{title:'Dashboard',business:businessName,userLogo:businessLogo});
         }
      }else{
        var errMsg='';
          errors.forEach(function(err){
            errMsg=err.msg+'<br>'
          })
          req.flash('error',errMsg);
        var businessName=req.user[0].shopName;
        var businessLogo=req.user[0].shopLogo;
         res.render('Dashboard/addProducts',{title:'Dashboard',business:businessName,userLogo:businessLogo});
      }

})
 //editing the product
 app.get('/editProduct/:id',function(req,res,next){
   var productid=req.params.id;
    var oneProduct=theProduct.oneProduct(productid);
    oneProduct.then(function(results){
      res.send(results);
    }).catch(function(err){
        res.send(err);
    })
 })
app.post('/editProduct',function(req,res,next){
  var shopID=req.user[0].shopID;
  var products=theProduct.allProducts(shopID);
   var productID=req.body.id;
   var product={
     productName:req.body.productName,
     price:req.body.price,
     description:req.body.description,
     updatedBy:req.user[0].firstName+'-'+req.user[0].lastName,
     unitMeasure:req.body.unit
   }
   var update=theProduct.editProduct(productID,product);
   update.then(function(results){
    /*  products.then(function(resultats){
        res.send(resultats);
      })*/
    req.flash('success','succesfully updated');
     res.redirect('/view')
   }).catch(function(err){
     req.flash('error','Invalid data format make sure you use numbers for price');
      res.redirect('/view')
    //  res.send(err)
   })
})
//loging out from the dashboard
app.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
})



/*app.get('*',function(req,res){
     var kategori=allCategories.finalObject;
  res.render('pageNotFound',{title:'not found',category:kategori})
})*/
module.exports=app;
