const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const CartItem = sequelize.define('cartitem',{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : true,
        primaryKey : true
    },
    quantity : {
        type: Sequelize.INTEGER,
        allowNull: false
    }
    
});

module.exports = CartItem;