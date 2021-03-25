let express = require('express'); // require returns a function;
let app = express(); //then we call on this function, which will return all the things express give us, and put then in a variable for further reference.
let cors = require('cors');

app.get('/products/:id', cors(), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for a Single Route'})
  });

let server = app.listen(process.env.PORT || 3000); // this will use one method inside of app (express()) and this will listen on the port 3000;

app.use(express.static('public')); // this will host public folder as the static website
console.log('my socket server is running');

let socket = require('socket.io',{
    cors: {
      origin: "https://multi-drawing-tool.herokuapp.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  }); // require socket
let io = socket(server);
io.sockets.on('connection',(socket)=>{
    console.log('new connection!' + socket.id);
    socket.on('mouse', (data)=>{
        socket.broadcast.emit('mouse',data); // you can alter the data here and then send it to broadcast. This will send to everyone else
        // io.sockets.emit('mouse',data); //this will send to everyone including myself.
        // console.log(data);
    });
    socket.on('user',(userId)=>{
        // console.log(userId);
        socket.broadcast.emit('user',userId);
    });
});


// let serialserver = require('./node_modules/p5.serialserver/p5.serialserver.js');
// serialserver.start(8081);

// console.log("p5.serialserver is running");