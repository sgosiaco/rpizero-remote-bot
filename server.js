process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

const express = require('express');
const raspividStream = require('raspivid-stream');

const app = express();
const wss = require('express-ws')(app);
const port = 3000

const rpio = require('rpio')

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.ws('/video-stream', (ws, req) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
      action: 'init',
      width: '640',
      height: '480'
    }));

    var videoStream = raspividStream({
      width: 640,
      height: 480,
      framerate: 30, 
      rotation: 180 
    });

    videoStream.on('data', (data) => {
        ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
    });

    ws.on('close', () => {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    });
});

app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
})

app.listen(port, () => {
  rpio.open(37, rpio.OUTPUT, rpio.LOW);
  rpio.open(35, rpio.OUTPUT, rpio.LOW);
  rpio.open(33, rpio.OUTPUT, rpio.LOW);
  rpio.open(31, rpio.OUTPUT, rpio.LOW);
  rpio.open(29, rpio.OUTPUT, rpio.LOW);
  rpio.open(27, rpio.OUTPUT, rpio.LOW);
  console.log(`Server started on ${port}`)
});

app.use(express.urlencoded({ extended: true }))

app.post('/forward', (req, res) => {
  console.log('/forward');
  led(0)
  res.sendStatus(200);
});

app.post('/backward', (req, res) => {
  console.log('/backward');
  led(1)
  res.sendStatus(200);
});

app.post('/left', (req, res) => {
  console.log('/left');
  led(2)
  res.sendStatus(200);
});

app.post('/right', (req, res) => {
  console.log('/right');
  led(3)
  res.sendStatus(200);
});

app.post('/off', (req, res) => {
  console.log('/off');
  led(6)
  res.sendStatus(200);
});

app.post('/led', (req, res) => {
  console.log(req.body.num);
  if (req.body.num >= 0 && req.body.num <= 6 ) {
    led(req.body.num)
  }
  //res.sendStatus(200);
});

function led(num) {
  console.log(`Switching on led ${num}`)
  rpio.write(37, rpio.LOW);
  rpio.write(35, rpio.LOW);
  rpio.write(33, rpio.LOW);
  rpio.write(31, rpio.LOW);
  rpio.write(29, rpio.LOW);
  rpio.write(27, rpio.LOW);
  switch(parseInt(num)) {
    case 0:
      rpio.write(37, rpio.HIGH);
      break;
    case 1:
      rpio.write(35, rpio.HIGH);
      break;
    case 2:
      rpio.write(33, rpio.HIGH);
      break;
    case 3:
      rpio.write(31, rpio.HIGH);
      break;
    case 4:
      rpio.write(29, rpio.HIGH);
      break;
    case 5:
      rpio.write(27, rpio.HIGH);
      break;
    default:
      console.log('default')
      break;
  }
}