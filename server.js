const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode");
const socketIO = require("socket.io");
const http = require("http");

// initial instance
const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth()
});

// index routing and middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

// initialize whatsapp and the example event
client.on("message", (msg) => {
  if (msg.body.includes('hello')) {
    client.sendMessage(msg.from, 'Hello World!');
  }
});
client.initialize();

// socket connection
var today = new Date();
var now = today.toLocaleString();
io.on("connection", (socket) => {
  socket.emit("message", `${now} Connected`);

  client.on("qr", (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", `${now} QR Code received`);
    });
  });

  client.on("ready", () => {
    socket.emit("message", `${now} WhatsApp is ready!`);
  });

  client.on("auth_failure", function (session) {
    socket.emit("message", `${now} Auth failure, restarting...`);
  });
});


// send message routing
app.post("/send", (req, res) => {
  const phone = req.body.phone;
  const message = req.body.message;

  client
    .sendMessage(phone, message)
    .then((response) => {
      res.status(200).json({
        error: false,
        data: {
          message: "Pesan terkirim",
          meta: response,
        },
      });
    })
    .catch((error) => {
      // console.log('error', error)
      res.status(200).json({
        error: true,
        data: {
          message: "Error send message",
          meta: error,
        },
      });
    });
});

server.listen(PORT, () => {
  console.log("App listen on port ", PORT);
});
