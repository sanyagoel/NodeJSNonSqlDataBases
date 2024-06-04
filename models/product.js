const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const Product = sequelize.define('product',{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : true,
        primaryKey : true
    },
    title : {
        type: Sequelize.STRING,
        allowNull : false
    },

    price : {
        type : Sequelize.DOUBLE,
        allowNull : false
    },
    
    description : {
        type: Sequelize.STRING,
        allowNull : false
    },

    imageurl : {
        type: Sequelize.STRING,
        allowNull : false
    }
});

module.exports = Product;