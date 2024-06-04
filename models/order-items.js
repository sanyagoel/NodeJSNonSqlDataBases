const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const OrderItem = sequelize.define('orderitem',{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : true,
        primaryKey : true
    },

    quantity : {
        type: Sequelize.INTEGER
    }

});

module.exports = OrderItem;