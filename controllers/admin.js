const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title:title,
      price:price,
      imageUrl:imageUrl,
      description:description
    })
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(result => {
      console.log('Updated product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        console.log('Product not found');
        return res.status(404).redirect('/admin/products');
      }
      return product.destroy()
        .then(result => {
          console.log('Destroyed Product');
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('An error occurred while deleting the product.');
    });
};
