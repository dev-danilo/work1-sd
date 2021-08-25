const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

io.on("connection", (socket) => {
  console.log(`socket conectado: ${socket.id}`);

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (data) => {
    const { student, note1, note2, note3 } = data;

    const average = (
      (parseFloat(note1) + parseFloat(note2) + parseFloat(note3)) /
      3
    ).toFixed(2);

    const dataStudent = {
      student,
      average,
    };

    messages.push(dataStudent);
    socket.broadcast.emit("receivedMessage", dataStudent);
  });
});

server.listen(3333);
