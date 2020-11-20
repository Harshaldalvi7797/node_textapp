const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const port = 3000;
const socketio = require('socket.io');
const Nexmo = require('nexmo');

// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '31701eae',
  apiSecret: 'IBOGq3MeNrz9mp0N'
}, {
  debug: true
});
// Template engine setup
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + "/public"));
// Index route
app.get("/", (req, res) => {
  res.render("index");
});
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// Catch form submit
app.post('/', (req, res) => {
  res.send(req.body);
  console.log(req.body);
  const {
    number,
    text
  } = req.body;

  nexmo.message.sendSms(
    '8087737437', number, text, {
      type: 'unicode'
    },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        // const {
        //   messages
        // } = responseData;
        // const {
        //   ['message-id']: id, ['to']: number, ['error-text']: error
        // } = messages[0];
        console.dir(responseData);
        // Get data from response
        // const data = {
        //   id,
        //   number,
        //   error
        // };

        // Emit to the client
        //io.emit('smsStatus', data);
      }
    }
  );
});


const server = app.listen(port, () => {
  console.log(`connected ${port}`);
});


// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
});