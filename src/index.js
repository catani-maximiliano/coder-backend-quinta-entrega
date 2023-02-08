const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const morgan = require("morgan");
const router = require("./router");

const port = 3000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");

router(app);

app.get("/", (req, res) => {
  res.render("index.handlebars", {
    mesagge: "Hi from server without socket.io",
  });
});

const httpServer = app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

global.io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`New client with id: ${socket.id}`);

  socket.on("statusProductsList", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});
