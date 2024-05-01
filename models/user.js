const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Cart = require('./cart');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Define the association between User and Cart
User.hasOne(Cart);

// Define the getCart method to retrieve the user's cart
User.prototype.getCart = function() {
    return Cart.findOne({ where: { userId: this.id } });
};

module.exports = User;
