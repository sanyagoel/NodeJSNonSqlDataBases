const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const Cart = sequelize.define('cart',{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : true,
        primaryKey : true
    }
    
});

module.exports = Cart;