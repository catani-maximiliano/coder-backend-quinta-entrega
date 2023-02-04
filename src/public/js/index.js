const socket = io()
const {getProductFromDB} = require('../../products/functionProducts')

const productos = document.getElementById('productos')


const startChat = async () => {

  const products= getProductFromDB();
  socket.emit('update-product', products)

  socket.on('update-product', products => {

  })


  socket.on('allChats', data => {
    if (data) {
      //console.log(user)
      //console.log('el usuario')
      data.forEach(productos => productos.innerHTML += `${productos.name}`)
    }
  })


}
startChat()


