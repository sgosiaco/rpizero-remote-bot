const WebSocket =  require('ws')

const wss = new WebSocket.Server({
	port: 3000
})

console.log('Started')

wss.on('connection', (ws, req) => {
	console.log(`Connected from ${req.socket.remoteAddress}`)
	ws.on('open', () => {
		console.log('WS opened')
	})
	ws.on('message', (message) => {
		console.log(`Received: ${message}`)
		ws.send(`Received: ${message}`)
	})
	ws.on('close', (code, reason) => {
		console.log(`Closed: ${reason}`)
	})
})
