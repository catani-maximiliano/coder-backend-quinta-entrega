const {Router} = require('express')
const uuid = require('uuid');
const cartsRouter = Router();
const { getCartFromDB, addCartToDB, updateCartInDB } = require('./functionCarts.js');

//OK
// Ruta raíz POST para crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const body = req.body;
        // Generar id único
        const id = uuid.v4();
        // Crear objeto de carrito
        const newCart = {
            id,
            products: [body]
        };
        // Agregar carrito a la base de datos
        await addCartToDB(newCart);
        res.status(200).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//OK
//La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        // Obtener carrito de la base de datos
        const cart = await getCartFromDB(cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//
//La ruta POST  /:cid/product/:pid 
//deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        // Obtener carrito de la base de datos
        let cart = await getCartFromDB(cid);
        // Buscar si el producto ya existe en el carrito
        let existingProduct = cart.products.find(p => p.product === pid)
        if (existingProduct) {
            // Incrementar cantidad del producto existente
            existingProduct.quantity += 1;
        } else {
            // Agregar nuevo producto al carrito
            cart.products.push({ product: pid, quantity: 1 });
        }
        // Actualizar carrito en la base de datos
        await updateCartInDB(cid, cart);
        res.status(200).json({ message: 'Producto agregado exitosamente', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = cartsRouter;