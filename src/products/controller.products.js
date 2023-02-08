const {Router} = require('express')
const uuid = require('uuid');

const productsRouter = Router();
const { getProductFromDB, getAllProductsFromDB, addProductToDB, updateProductInDB, deleteProductFromDB  } = require('./functionProducts');

//Ok
// Ruta raíz GET / para listar todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;

        // Obtener productos de la base de datos
        const products = await getAllProductsFromDB(limit);
        const getAll =  await getAllProductsFromDB();
        global.io.emit('statusProductsList', getAll);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//OK
// Ruta GET /:pid para obtener un producto específico
productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        // Obtener producto de la base de datos
        const product = await getProductFromDB(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//OK
//La ruta raíz POST / deberá agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
    try {
        const body = req.body;
        // Generar id único
        const id = uuid.v4();
        // Crear objeto de producto

        const newProduct = {
            id,
            status: true,
            stock: body.stock,
            category: body.category,
            thumbnails: body.thumbnails,
            title: body.title,
            description: body.description,
            code: body.code,
            price: body.price
        };
        // Validar campos obligatorios
        if (!newProduct.stock || !newProduct.category || !newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price) {
            throw new Error('Faltan campos obligatorios');
        }
        // Agregar producto a la base de datos
        await addProductToDB(newProduct);

        const getAll =  await getAllProductsFromDB();
        global.io.emit('statusProductsList', getAll);

        res.status(200).json({ message: 'Producto agregado exitosamente', product: newProduct });
    } catch (error) {
        if(error.error){
            res.status(400).json({error: error.error})
        }else{
            res.status(500).json({error: 'Error al agregar el producto.'});
        }
        
    }
});


//faltaria que si quiere modificar el code no se repita.
//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body
productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const body = req.body;
        // Obtener producto de la base de datos
        const product = await getProductFromDB(pid);
        // Actualizar campos del producto
        for (let field in body) {
            if (field !== 'id') {
                product[field] = body[field];
            }
        }
        // Actualizar producto en la base de datos
        await updateProductInDB(pid, product);

        const getAll =  await getAllProductsFromDB();
        global.io.emit('statusProductsList', getAll);

        res.json({ message: 'Producto actualizado exitosamente', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//OK
//La ruta DELETE /:pid deberá eliminar el producto con el pid indicado
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        // Eliminar producto de la base de datos
        await deleteProductFromDB(pid);

        const getAll =  await getAllProductsFromDB();
        global.io.emit('statusProductsList', getAll);
        
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = productsRouter