const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const router = require("./router/index");
const morgan = require("morgan");

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.use(morgan("dev"));

router(app);

const httpServer = app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`New client with id: ${socket.id}`);

  socket.emit("product-update", products);

  socket.on("product-update", (products) => {
    socket.emit("productos", messages);
  });
});
