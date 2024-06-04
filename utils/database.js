const mysql = require('mysql2');

/*const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node-complete',
    password:'1234'
})

module.exports = pool.promise();*/

const Sequelize = require('sequelize').Sequelize;
const sequelize = new Sequelize('node-complete','root','1234',{dialect : 'mysql', host : 'localhost'});

module.exports = sequelize;


/*One quick note:

With Sequelize v5, findById() (which we'll use in this course) was replaced by findByPk().

You use it in the same way, so you can simply replace all occurrences of findById() with findByPk() */