const fs = require("fs");
const path = "./src/products/products.json";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify([], null, "\t"));
}

async function getAllProductsFromDB(limit) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          if (limit) {
            products = products.slice(0, limit);
          }
          resolve(products);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function getProductFromDB(pid) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          let product = products.find((p) => p.id === pid);
          if (!product) {
            reject(new Error(`No se encontró un producto con el id ${pid}`));
          } else {
            resolve(product);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function addProductToDB(newProduct) {
  try {
    // Leer el archivo de productos
    const data = await fs.promises.readFile(path);
    const products = JSON.parse(data);

    // Verificar si el código del producto ya existe
    const existingProduct = products.find(
      (product) => product.code === newProduct.code
    );

    if (existingProduct) {
      throw { 'error': "el codigo de producto ya existe." };
    }
    // Agregar el nuevo producto a la lista de productos
    products.push(newProduct);

    // Escribir la lista de productos actualizada al archivo
    await fs.promises.writeFile(path, JSON.stringify(products));
    return newProduct;
  } catch (error) {
    throw error;
  }

}

async function updateProductInDB(pid, updatedProduct) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          let productIndex = products.findIndex((p) => p.id === pid);
          if (productIndex === -1) {
            reject(new Error(`No se encontró un producto con el id ${pid}`));
          } else {
            // actualizar los campos del producto
            Object.assign(products[productIndex], updatedProduct);
            fs.writeFile(path, JSON.stringify(products), (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(products[productIndex]);
              }
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function deleteProductFromDB(pid) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          let productIndex = products.findIndex((p) => p.id === pid);
          if (productIndex === -1) {
            reject(new Error(`No se encontró un producto con el id ${pid}`));
          } else {
            products.splice(productIndex, 1);
            fs.writeFile(path, JSON.stringify(products), (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

module.exports = {
  getProductFromDB,
  getAllProductsFromDB,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
};
