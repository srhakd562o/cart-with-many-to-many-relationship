const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '@SITAram5620', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
