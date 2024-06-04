const express = require('express');
const Sequelize = require('sequelize').Sequelize;
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-items');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');


const path = require('path');
const app = new express();
const rootDir = require('./utils/path');
const homeroute = require('./routes/home');
const userroute = require('./routes/users');
const bodyparser = require('body-parser');
const expresshbr = require('express-handlebars');
const notfound = require('./controllers/404con.js');
const db = require('./utils/database.js');
//app.engine('hbs',expresshbr({layoutsDir:'views/layouts/',defaultLayout:'layout1.hbs',extname:'hbs'}));
//app.set('view engine','hbs'); //could change name from hbs to anything, but ur file name extension should be same ie .hbs
//app.set('view engine','pug'); //pug is the template engine we are gonna use 
app.set('view engine','ejs');
app.set('views', 'views'); //because the folder which contains our html files , its name is views/
app.use(express.static(path.join(rootDir,'public')));
app.use((req,res,next)=>{
    User.findByPk(1).then((user)=>{
        req.user = user;
        next();
    }).catch((err)=>{
        console.log(err);
    });

})
app.use(bodyparser.urlencoded({extended:true}));
app.use('/admin',userroute.route);
app.use('/',homeroute);

app.use(notfound.notf);

/*db.execute('SELECT * FROM products').then(result=>{
    console.log(result[0]);
}).catch((err)=>{
    console.log(err);
});*/

//db.execute('INSERT INTO products VALUES(null,"boo444444k",5.3,"this is princess","url")')

Product.belongsTo(User,{constraints : true , onDelete : 'CASCADE'}); //that on deleting a user all the products belonging to that user also get deleted
User.hasMany(Product); //just for understandibng the relation if u wrote the first line no need for this as well both mean same thing
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product , {through : CartItem});
Product.belongsToMany(Cart, {through : CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , {through : OrderItem});
Product.belongsToMany(Cart , {through : OrderItem});


//sync({force : true} whenu want to overide table properties //forgot to add relation or sm
sequelize.sync().then((result)=>{
    return User.findByPk(1);
    }
).then((user)=>{
    if(!user){
        User.create({
            name: "sanya",
            email : "sa123"
        }
        );
    }
    return user;
}).then((user)=>{
    return user.createCart();
}).then(()=>{
    app.listen(3000);
}).catch((err)=>{
    console.log(err);
});

//templating engines, - eejs, pug, handlebars
//npm install pug--save
//npm install --save express-handlebars@3.0
//npm install --save ejs
