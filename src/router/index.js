const productsController = require('../products/controller.products');
const cartsController = require('../carts/controller.carts');
const realTimeProductsController = require('../realTime/controller.realTimeProducts');


const router = (app) => {
  app.use('/api/products', productsController);
  app.use('/api/carts', cartsController);
  app.use('/realTimeProducts', realTimeProductsController);
}

module.exports = router