console.log('Client-side code running');
//var canvas = document.createElement("canvas");
//document.body.appendChild(canvas);
//var wsavc = new WSAvcPlayer(canvas, "webgl");
const wsavc = new WSAvcPlayer.default({useWorker:false});
document.getElementById('video').appendChild(wsavc.AvcPlayer.canvas)
var protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
wsavc.connect(protocol + '//' + window.location.host + '/video-stream');


const forward = document.getElementById('forward');
const backward = document.getElementById('backward');
const left = document.getElementById('left');
const right = document.getElementById('right');
const off = document.getElementById('off');

forward.addEventListener('click', f);

backward.addEventListener('click', b);

left.addEventListener('click', l);

right.addEventListener('click', r);

off.addEventListener('click', o);

function f() {
  console.log('forward');
  fetch('/forward', { 
    method: 'POST'
  })
}

function b() {
  console.log('backward');
  fetch('/backward', { 
    method: 'POST'
  })
}

function l() {
  console.log('left');
  fetch('/left', { 
    method: 'POST'
  })
}

function r() {
  console.log('right');
  fetch('/right', { 
    method: 'POST'
  })
}

function o() {
  console.log('off');
  fetch('/off', { 
    method: 'POST'
  })
}

hotkeys('w,a,s,d,q,e', (event, handler) => {
  switch(handler.key) {
    case 'w':
      f()
      break;
    case 'a':
      l()
      break;
    case 's':
      b()
      break;
    case 'd':
      r()
      break;
    case 'q':
      o()
      break;
    case 'e':
      console.log('e')
      break;
    default:
      break;
  }
})