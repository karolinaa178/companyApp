// post.routes.js

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products.controller');

router.get('/products', PorductController.getAll);

router.get('/products/random', PorductController.getRandom);

router.get('/products/:id', PorductController.getById);

router.post('/products', PorductController.addDepartment);

router.put('/products/:id', PorductController.editById);

router.delete('/products/:id', PorductController.deleteById);

module.exports = router;
