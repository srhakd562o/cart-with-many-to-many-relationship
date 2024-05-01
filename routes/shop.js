const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart); // Route for adding a product to the cart
router.post('/cart/delete-product', shopController.postCartDeleteProduct); // Route for deleting a product from the cart
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;
