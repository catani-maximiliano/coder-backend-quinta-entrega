
const productsController = require ('../../../cuarta-entrega/src/products/controller.products')
const cartsController = require('../carts/controller.carts')
const controllerHome = require('../home/controller.home')
const controllerRealTime = require('../RealTimeProducts/controller.realTimeProducts')

const router = (app) => {
  app.use("/api/products/", productsController);
  app.use("/api/carts/", cartsController);
  app.use('/', controllerHome)
  app.use('/realtimeproducts', controllerRealTime)
};

module.exports = router;