
const { addProduct } = require('../models/cart');
const Product = require('../models/product');
const Cart = require('../models/cart.js');
const Order = require('../models/order.js');

const fs = require('fs');
const rootDir = require('../utils/path');
const path = require('path');
const Sequelize = require('sequelize').Sequelize;

const getIndex = (req,res,next)=>{

    Product.findAll().then((products)=>{
        res.render('./shop/index',{pro : products , pageTitle : 'SHOP', hi:'Welcome to Home page :D', path:'tohome'});
    }
    ).catch((err)=>{
        console.log(err);
    })
    /*Product.fetchall().then(([rows,metaData])=>{
            console.log('Here is what its showing me;' , rows);
            res.render('./shop/index',{pro : rows , pageTitle : 'SHOP', hi:'Welcome to Home page :D', path:'tohome'});
    }).catch((err)=>{
        console.log(err);
    });*/
   // res.sendFile(path.join(rootDir,'views','home.html'));
}

const getProducts = (req,res,next)=>{
    
    req.user.getProducts().then((products)=>{
        res.render('./shop/products-list',{pro : products , pageTitle : 'SHOPSTER', hi:'Welcome to Products Page', path:'toproducc'});
    }
    ).catch((err)=>{
        console.log(err);
    })
   // res.sendFile(path.join(rootDir,'views','home.html'));
}

const getProduct = (req,res,next)=>{
    const prodID = req.params.id;
    Product.findAll({where : {'id' : prodID} }).then((products)=>{
        res.render('./shop/product-details.ejs',{product : products[0] , reqid : prodID , pageTitle : products[0].title , hi: 'Get indivisual detail' , path: 'toindivis'});
    }
    ).catch((err)=>{
        console.log(err);
    });
    /*Product.findByPk(prodID).then((products)=>{
        res.render('./shop/product-details.ejs',{product : products , reqid : prodID , pageTitle : 'PRODUCT DETAIL' , hi: 'Get indivisual detail' , path: 'toindivis'});
    }).catch((err)=>{
        console.log(err);
    })*/
    /*Product.fetchall((products)=>{
    console.log(prodID);
    res.render('./shop/product-details.ejs',{pro : products , reqid : prodID , pageTitle : 'PRODUCT DETAIL' , hi: 'Get indivisual detail' , path: 'toindivis'});
        });*/
}


const getCart = (req,res,next)=>{
    req.user.getCart().then((cart)=>{
        return cart.getProducts();
    }).then((products)=>{
        res.render('./shop/cart.ejs',{productcart : products , pageTitle : 'CART' , hi : 'Buy Stuff From Cart' , path : 'tocart' });
    }).catch((err)=>{
        console.log(err);
    })
}



const postCart = (req,res,next)=>{
    const prodid = req.body.productid;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart().then((cart)=>{
        fetchedCart = cart;
        return cart.getProducts({where : { id : prodid}});
    }).then((products)=>{
        let product;
        if(products.length>0){
            product = products[0];
        }
        if (product){
            newQuantity = product.cartitem.quantity + 1;
            return fetchedCart.addProduct(product,{through : { quantity : newQuantity}});
        }
        return Product.findByPk(prodid).then(
            (product)=>{
                return fetchedCart.addProduct(product,{through : { quantity : newQuantity}});
            });
    })
    .then(()=>{
        res.redirect('/cart');
    }).catch((err)=>{
        console.log(err);
    });
}

const getCheckout = (req,res,next)=>{
    res.render('./shop/checkout.ejs',{pageTitle : 'CHECKOUT' , hi : 'Checkout Stuff From Cart' , path : 'tocheckout' });
}
const getProductInfo = (req,res,next)=>{
    res.render('./shop/product-info.ejs',{pageTitle : 'PRODUCT INFORMATION' , hi : 'Get Product Information' , path : 'toinfo' });
}

const removeItem = (req,res,next)=>{
    const prodID = req.params.id;
    req.user.getCart().then((cart)=>{
        return cart.getProducts({where : {id : prodID}});
    }).then((products)=>{
        let product = products[0];
        return product.cartitem.destroy();
    }).then(()=>{
        res.redirect('/cart');
    }).catch();
}

const getOrder = (req,res,next)=>{
    req.user.getOrders({include : ['products']}).then((orders)=>{
        res.render('./shop/orders',{pageTitle : 'SHOP', hi:'Welcome to Orders :D', path:'toords' , orders: orders});
    }).catch((err)=>{
        console.log(err);
    });
}

const createOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            return req.user
                .createOrder()
                .then((order) => {
                    order.addProducts(
                        products.map((product) => {
                            product.orderitem = {
                                quantity: product.cartitem.quantity,
                            };
                            return product;
                        })
                    );
                })
                .catch((err) => console.log(err));
        })
        .then((result) => {
            return fetchedCart.setProducts(null);
        })
        .then((result) => {
            fetchedCart.setProducts(null);
            res.redirect('/orders');
        })
        .catch((err) => console.log(err));
};



module.exports = {
    getin : getIndex,
    getpr : getProducts,
    getc : getCart,
    getch : getCheckout,
    getpi : getProductInfo,
    getpid : getProduct,
    postc : postCart,
    removeit : removeItem,
    geto : getOrder,
    createOrd : createOrder
}
