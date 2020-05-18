const AvcServer = require('ws-avc-player/lib/server')
const WebSocket  = require('ws')

const path = require('path')
const http = require('http')

const net = require('net')
const { spawn } = require('child_process')

const width = 1280 //1024
const height = 720 //576


const wss = new WebSocket.Server({
    port: 3000
})
const avcServer = new AvcServer(wss, width, height)

let stream = null

console.log(`Res: ${width} ${height}`)
console.log(`WS port 3000`)

const startStream = () => {
    console.log('Starting raspivid')
    stream = spawn('raspivid', [ '-n', '-vf', '-hf', '-pf', 'baseline', '-ih', '-t', '0', '-w', width, '-h', height, '-fps', '30', '-g', '30', '-o', '-' ])
    stream.on('close', () => {
        stream = null
    })
    avcServer.setVideoStream(stream.stdout)
}

avcServer.on('client_connected', () => {
    console.log('Client connected')
    if(!stream) {
        startStream()
	}
})

avcServer.on('client_disconnected', () => {
    console.log('Client disconnected')
    if(avcServer.clients.size < 1) {
        if(!stream) {
            console.log('raspivid not running')
            return
        }
        console.log('Stopping raspivid')
        stream.kill('SIGTERM')
    }
})
