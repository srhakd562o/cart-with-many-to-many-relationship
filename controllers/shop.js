const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
            next(err); // Pass error to the next middleware
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
            next(err); // Pass error to the next middleware
        });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    });
                });
        })
        .catch(err => {
            console.log(err);
            next(err); // Pass error to the next middleware
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1; // Define newQuantity

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                // If product exists, increase quantity
                newQuantity = product.cartItem.quantity + 1;
                return product;
            }
            return Product.findByPk(prodId); // Fetch product by ID
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            next(err); // Pass error to the next middleware
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            next(err); // Pass error to the next middleware
        });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
