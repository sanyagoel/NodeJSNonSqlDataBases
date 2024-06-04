const path = require('path');
const rootDir = require('../utils/path');

const p = path.join(rootDir,'data','productData.json');

const fs = require('fs');

const Product = require('../models/product');
const Cart = require('../models/cart');

const getaddproducts = (req,res,next)=>{
    res.render('./admin/add-product' , {pageTitle : 'ADD PRODUCTS', productcardcss : true , hi:'ADD PRODUCTS :3',path:'tousers'});
    //res.sendFile(path.join(rootDir,'views','users.html'));
}


const postproductarr = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageurl;
    const price = req.body.price;
    const description = req.body.description;
    //const product = new Product(title, imageUrl, description, price);
    /*product
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
  };*/
  req.user.createProduct({
    title : title,
    imageurl : imageUrl,
    price : price,
    description : description,
    userId : req.user.id
  }).then(()=>{
    console.log('created');
    res.redirect('/');
  }).catch((err)=>{
    console.log(err);
  });

}

const getadminprod = (req,res,next)=>{
    req.user.getProducts().then((products)=>{
        res.render('./admin/products',{pro : products , pageTitle : 'ADMIN PRODUCTS LIST', hi:'Welcome to admin products list ', path:'toadminprod'});

    }).catch((err)=>{
        console.log(err);
    })

    /*Product.fetchall((products)=>{
    console.log('Here is what its showing me;' , products);
    res.render('./admin/products',{pro : products , pageTitle : 'ADMIN PRODUCTS LIST', hi:'Welcome to admin products list ', path:'toadminprod'});
    });*/
    
   // res.sendFile(path.join(rootDir,'views','home.html'));
}

const editProd = (req,res,next)=>{
    /*const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }*/
    const prodID = req.params.id;
    req.user.getProducts({where : { id : prodID}}).then((product)=>{
        res.render('./admin/edit-prod.ejs',{productf : product[0] , path: 'edit', hi:'edit product details!', pageTitle : 'edit products' });
    }).catch((err)=>{
        console.log(err);
    })
    
}

const editProdPost = (req, res, next) => {
    const prodID = req.params.id;
    const updatedProduct = {
        id: prodID,
        title: req.body.usernames,
        description: req.body.description,
        imageurl: req.body.imageurl,
        price: req.body.price,
    };
    req.user.getProducts({where : {id : prodID}}).then((product)=>{ //magic association method
        product = product[0];
        product.id = prodID;
        product.title = updatedProduct.title;
        product.description = updatedProduct.description;
        product.imageurl = updatedProduct.imageurl;
        product.price = updatedProduct.price;
        return product.save();
    }   
    )
    .then(()=>{
        console.log('result updated');
    }).catch((err)=>{
        console.log(err);
    });
    res.redirect('/');
};


const deleteProd = (req,res,next)=>{
    const prodID = req.params.id;
    Product.findByPk(prodID).then((product)=>{
        return product.destroy();
    }).then(()=>{
        console.log('product deleted :)');
        res.redirect('/');
    }).catch((err)=>{
        console.log(err);
    })
/*    Product.fetchall((products)=>{
        const prodindex = products.findIndex(p=> p.id==prodID);
        if(prodindex!=-1){
            products.splice(prodindex,1);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                if(err){
                    console.log(err);
                }
            })
        }
    });
    let price=0;
    Product.findbyID(prodID,(prod)=>{
        price = prod.price;
    })
    Cart.fetchallcart((cartProducts)=>{
        const cartIndex = cartProducts.products.findIndex(p=> p.id == prodID );
        if(cartIndex!=-1){
            cartProducts.totalPrice = cartProducts.totalPrice - price*(cartProducts.products[cartIndex].qty);
            cartProducts.products.splice(cartIndex,1);
            fs.writeFile(path.join(rootDir,'data','cardData.json'),JSON.stringify(cartProducts),(err)=>{
                if(err){
                    console.log(err);
                }
            })
        }
    })
    res.redirect('/'); */
}


module.exports = {
    getap : getaddproducts,
    postproar : postproductarr,
    getadmp : getadminprod,
    getedp : editProd,
    postedp : editProdPost,
    delp :deleteProd
}
