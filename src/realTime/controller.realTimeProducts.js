const { Router } = require('express');
const router = Router();

const { ProductManager } = require("../classManagers/productManager");
const productsJson = new ProductManager("./src/classManagers/products.json");

//Url ejemplos
//http://localhost:8080/realTimeProducts
//http://localhost:8080/realTimeProducts?limit=5
router.get('/', async (req, res) => {
    const getAll = await productsJson.getProducts();
    global.io.emit('productsList', getAll);
    res.render('realTimeProducts.handlebars', { getAll });



});



module.exports = router;