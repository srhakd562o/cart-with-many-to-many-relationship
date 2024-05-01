const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the Sequelize models are synchronized before accessing the user
sequelize.sync()
    .then(result => {
        // Middleware to find a dummy user (replace 1 with the actual user ID)
        app.use((req, res, next) => {
            User.findByPk(1)
                .then(user => {
                    // Assign the user to the request object
                    req.user = user;
                    next();
                })
                .catch(err => console.log(err));
        });

        // Routes
        app.use('/admin', adminRoutes);
        app.use(shopRoutes);

        // 404 error handler
        app.use(errorController.get404);

        // Define associations
        Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
        User.hasMany(Product);
        User.hasOne(Cart);
        Cart.belongsTo(User);
        Cart.belongsToMany(Product, { through: CartItem });
        Product.belongsToMany(Cart, { through: CartItem });

        // Start server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
